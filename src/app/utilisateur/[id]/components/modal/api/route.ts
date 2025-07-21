import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import {
    SessionData,
    sessionOptions,
} from "../../../../../lib/session";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import validator from "validator";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await checkRateLimit(request, {
        points: 5,
        duration: 60,
        keyPrefix: "rlflx-utilisateur-modal-api"
    });
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
    if (session.isLoggedIn !== true) {
        return NextResponse.json(
            {
                status: 401,
                message: "Vous n'êtes pas connecté, veuillez réessayer",
            },
            {
                status: 401,
            }
        );
    } else {
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
            if (user.role !== "ROLE_ADMIN") {
                return NextResponse.json(
                    {
                        status: 401,
                        message: "Vous n'avez pas accès à cette page, veuillez réessayer",
                    },
                    {
                        status: 401,
                    }
                );
            } else {
                const { id } = (await request.json()) as {
                    id: string;
                };
                if (validator.isUUID(id) !== true) {
                    return NextResponse.json(
                        {
                            status: 400,
                            message: "L'identifiant de l'utilisateur est invalide",
                        },
                        {
                            status: 400,
                        }
                    );
                } else {
                    const userById = await prisma.user.findUnique({
                        where: { id: id },
                        include: {
                            offre_test: true,
                            meeting_test: true
                        }
                    });
                    if (userById === null) {
                        return NextResponse.json(
                            {
                                status: 404,
                                message: `L'utilisateur avec l'id : ${id} n'a pas été trouvé, veuillez réessayer`,
                            },
                            {
                                status: 404,
                            }
                        );
                    } else {
                        const editOffre = await prisma.offre_test.update({
                            where: { id: userById.offreId! },
                            data: {
                                currentMeetingId: null,
                                currentNumberOfMeeting: null
                            }
                        })
                        const editUser = await prisma.user.update({
                            where: { id: userById.id },
                            data: {
                                meetingId: null
                            }
                        })
                        const removeMeet = await prisma.meeting_test.delete({
                            where: { id: userById.meetingId! }
                        })
                        return NextResponse.json(
                            {
                                status: 200,
                                message: `Un mail a été envoyé a l'utilisateur ${userById.mail}`,
                            },
                            {
                                status: 200,
                            }
                        );
                    }
                }
            }
        }
    }
    } catch (error) {
        handleError(error)
    }
    
}
