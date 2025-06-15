import prisma from "@/app/lib/prisma";
import { getRateLimiter } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import TwoFAData from "../../../TwoFAData";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
    const ip: any = request.headers.get("x-forwarded-for") || request.ip; // Récupérer l’IP
    try {
        const rateLimiter = await getRateLimiter(5, 60, "rlflx-profile-twofa");
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
            const editUser = await prisma.user.update({
                where: {id: user.id},
                data: {
                    isTwoFactorEnabled: !user.isTwoFactorEnabled,
                    twoFAToken: Prisma.JsonNull
                }
            })
            if (editUser === null) {
                return NextResponse.json(
                {
                    status: 404,
                    message:
                        "Impossible de modifier la double authentification, veuillez réessayer",
                },
                {
                    status: 404,
                }
            );
            } else {
                return NextResponse.json(
                {
                    status: 200,
                    message:
                        "La double authentification a été désactivé",
                },
                {
                    status: 200,
                }
            );
            }
        }
    }
}