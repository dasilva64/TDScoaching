import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers"
import nodemailer from 'nodemailer';
import { getIronSession } from "iron-session";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import { getRateLimiter } from "@/app/lib/rateLimiter";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
    const ip: any = request.headers.get("x-forwarded-for") || request.ip;
    try {
        const rateLimiter = await getRateLimiter(5, 60, "rlflx-login-2fa-resend");
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

    if (session.isLoggedIn === true) {
        let user = await prisma.user.findUnique({
            where: { id: session.id },
        });
        if (user === null) {
            session.destroy();
            return NextResponse.json(
                {
                    status: 400,
                    message:
                        "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
                },
                {
                    status: 400,
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
                    message: "L'utilisateur n'a pas été trouvé",
                },
                {
                    status: 400,
                }
            );
        } else {
            session.destroy();
            session.csrfToken = generateCsrfToken();
            session.updateConfig({
                ...sessionOptions,
                cookieOptions: {
                    ...sessionOptions.cookieOptions,
                    maxAge: 60 * 15,
                },
            });
            await session.save();
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
}
