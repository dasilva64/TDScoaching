import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";

export async function POST(request: NextRequest) {

    try {
        const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-profile-firstname');
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
                if (user.offreId) {
                    return NextResponse.json(
                        {
                            status: 400,
                            type: "error",
                            message:
                                "Vous ne pouvez pas désactiver ce parametre car vous avez une offre en cours, veuillez réessayer",
                        },
                        {
                            status: 400,
                        }
                    );
                }
                if (user.meetingId) {
                    return NextResponse.json(
                        {
                            status: 400,
                            type: "error",
                            message:
                                "Vous ne pouvez pas désactiver ce parametre car vous avez une rendez-vous en cours, veuillez réessayer",
                        },
                        {
                            status: 400,
                        }
                    );
                }
                let editUser = await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        saveCard: false,
                    },
                });
                if (editUser === null) {
                    return NextResponse.json(
                        {
                            status: 400,
                            type: "error",
                            message:
                                "Une erreur est survenue lors de la modification de la sauvegarde de votre carte, veuillez réessayer",
                        },
                        {
                            status: 400,
                        }
                    );
                } else {
                    let userObject = {
                        firstname: editUser.firstname,
                        lastname: editUser.lastname,
                        email: editUser.mail,
                    };
                    return NextResponse.json({
                        status: 200,
                        message: "Votre carte bancaire a été supprimé avec succès",
                        body: userObject,
                    });
                }

            }
        }
    } catch (error) {
        return handleError(error)
    }


}
