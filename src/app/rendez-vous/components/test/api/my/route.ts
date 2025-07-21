import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await checkRateLimit(request, {
            points: 5,
            duration: 60,
            keyPrefix: "rlflx-meet-resume"
        });
        if (rateLimitResponse) return rateLimitResponse;
        const session = await getIronSession<SessionData>(
            cookies(),
            sessionOptions
        );
        const csrfTokenHeader = headers().get("x-csrf-token");
        const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
        if (csrfCheckResponse) return csrfCheckResponse;
        if (session.isLoggedIn === true) {
            let user = await prisma.user.findUnique({
                where: { id: session.id },
            });
            if (user === null) {
                return NextResponse.json(
                    {
                        status: 401,
                        message:
                            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
                    },
                    {
                        status: 401,
                    }
                );
            } else {
                if (user.meetingId === null) {
                    return NextResponse.json(
                        {
                            status: 400,
                            message: "Vous n'avez aucun rendez-vous en cours, veuillez réessayer",
                        },
                        {
                            status: 400,
                        }
                    );
                } else {
                    try {
                        await prisma.$transaction(async (tx) => {
                            const editOffre = await prisma.offre_test.update({
                                where: { id: user.offreId! },
                                data: { currentMeetingId: null }
                            })
                            const editMeet = await prisma.user.update({
                                where: { id: user.id },
                                data: { meetingId: null }
                            })
                            return { editOffre, editMeet };
                        });

                        return NextResponse.json(
                            {
                                status: 200,
                                message: "Vous pouvez reprendre un rendez-vous",
                            },
                            {
                                status: 200,
                            }
                        );
                    } catch {
                        return NextResponse.json(
                            {
                                status: 400,
                                message: "Une erreur est survenue lors de la reprise du rendre-vous, veuillez réessayer",
                            },
                            {
                                status: 400,
                            }
                        );
                    }

                }
            }
        } else {
            return NextResponse.json(
                {
                    status: 401,
                    message: "Vous n'êtes pas connecté, veuillez vous connecter",
                },
                {
                    status: 401,
                }
            );
        }
    } catch (error: any) {
        handleError(error)
    }

}