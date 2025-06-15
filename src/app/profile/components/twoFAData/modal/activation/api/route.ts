import prisma from "@/app/lib/prisma";
import { getRateLimiter } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { Prisma } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const ip: any = request.headers.get("x-forwarded-for") || request.ip; // Récupérer l’IP
    try {
        const rateLimiter = await getRateLimiter(5, 60, "rlflx-profile-email-data");
        await rateLimiter.consume(ip);
    } catch (err) {
        return NextResponse.json(
            {
                status: 429,
                message: "Trop de requêtes, veuillez réessayer plus tard",
            },
            { status: 429 }
        );
    }
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    const csrfToken = headers().get("x-csrf-token");

    if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
        return NextResponse.json(
            { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
            { status: 403 }
        );
    }
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
            session.destroy();
            return NextResponse.json(
                {
                    status: 404,
                    message:
                        "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
                },
                {
                    status: 404,
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
}
