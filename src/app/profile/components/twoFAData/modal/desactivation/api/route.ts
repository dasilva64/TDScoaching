import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.fixedWindow(10, '60s'),
});

export async function POST(request: NextRequest) {
    try {
        const ip = request.ip ?? 'ip';
        const keyPrefix = "rlflx-rlflx-profile-twofa-disable";
        const key = `${keyPrefix}:${ip}`
        const { success, remaining } = await ratelimit.limit(key);

        if (!success) {
            return NextResponse.json(
                {
                    status: 429,
                    message: "Trop de requêtes, veuillez réessayer plus tard",
                },
                { status: 429 }
            );
        }
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
                const editUser = await prisma.user.update({
                    where: { id: user.id },
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
    } catch (error) {
        return handleError(error)
    }

}