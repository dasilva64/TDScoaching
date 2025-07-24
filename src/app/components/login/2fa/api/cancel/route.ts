import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers"
import { getIronSession } from "iron-session";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { Prisma } from "@prisma/client";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-login-2fa-cancel');
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
            }
            return NextResponse.json(
                {
                    status: 200,
                    message: "Vous êtes déjà connecté",
                },
                {
                    status: 200,
                }
            );
        } else {
            if (!session.id) {
                return NextResponse.json(
                    {
                        status: 400,
                        type: "error",
                        message:
                            "Erreur lors de la double authentification, veuillez réessayer",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }
        const { pseudo } = (await request.json()) as {
            pseudo: string;
        };
        if (pseudo.trim() !== "") {
            return NextResponse.json(
                {
                    status: 400,
                    type: "error",
                    message: "Vous ne pouvez pas vous connecter, veuillez réessayer",
                },
                {
                    status: 400,
                }
            );
        } else {
            const editUser = await prisma.user.update({
                where: {
                    id: session.id
                },
                data: {
                    twoFAToken: Prisma.JsonNull
                }
            })
            if (editUser === null) {
                return NextResponse.json(
                    {
                        status: 400,
                        message: "Erreur lors de la modification de la double authentification, veuillez réessayer",
                    },
                    {
                        status: 400,
                    }
                );
            } else {
                session.destroy();
                return NextResponse.json(
                    {
                        status: 200,
                        message: "Vous avez quitté la double authentification",
                    },
                    {
                        status: 200,
                    }
                );
            }

        }
    } catch (error) {
        handleError(error)
    }

}
