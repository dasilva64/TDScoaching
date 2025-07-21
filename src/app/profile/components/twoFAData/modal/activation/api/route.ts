import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { Prisma } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await checkRateLimit(request, {
        points: 5,
        duration: 60,
        keyPrefix: "rlflx-profile-email-data"
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
            const { code, pseudo } = (await request.json()) as {
                code: string;
                pseudo: string;
            };
            let arrayMessageError = validationBody({ code: code });

            if (arrayMessageError.length > 0) {
                return NextResponse.json(
                    {
                        status: 400,
                        type: "validation",
                        message: arrayMessageError,
                    },
                    {
                        status: 400,
                    }
                );
            }
            if (pseudo.trim() !== "") {
                return NextResponse.json(
                    {
                        status: 400,
                        type: "error",
                        message:
                            "Vous ne pouvez pas modifier votre email, veuillez réessayer",
                    },
                    {
                        status: 400,
                    }
                );
            } else {
                let copyEditTwoFA: any = user.twoFAToken;
                if (copyEditTwoFA === null) {
                    return NextResponse.json(
                        {
                            status: 400,
                            type: "error",
                            message:
                                "Aucune modification d'email n'as été demandée, veuillez réessayer",
                        },
                        {
                            status: 400,
                        }
                    );
                }
                if (copyEditTwoFA.token.trim() === code.trim()) {
                    if (new Date() > copyEditTwoFA.limitDate) {
                        let removeEditTwoFA = await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                twoFAToken: Prisma.DbNull,
                            },
                        });
                        if (removeEditTwoFA === null) {
                            return NextResponse.json(
                                {
                                    status: 400,
                                    type: "error",
                                    message:
                                        "Une erreur est survenue lors de la modification de la double authentification, veuillez réessayer",
                                },
                                {
                                    status: 400,
                                }
                            );
                        }
                        return NextResponse.json(
                            {
                                status: 400,
                                type: "error",
                                message: "Le code est expiré, veuillez réessayer",
                            },
                            {
                                status: 400,
                            }
                        );
                    }
                    let editUser = await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            isTwoFactorEnabled: true,
                            twoFAToken: Prisma.JsonNull
                        },
                    });
                    if (editUser === null) {
                        return NextResponse.json(
                            {
                                status: 400,
                                type: "error",
                                message:
                                    "Une erreur est survenue lors de la modification de la double authentification, veuillez réessayer",
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
                            message: "La double authentification est activé",
                            body: userObject,
                        });
                    }


                } else {
                    return NextResponse.json(
                        {
                            status: 400,
                            type: "error",
                            message: "Le code n'est pas correct, veuillez réessayer",
                        },
                        {
                            status: 400,
                        }
                    );
                }
            }
        }
    }
    }catch (error) {
        handleError(error)
      }
    
}
