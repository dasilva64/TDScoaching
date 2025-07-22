import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.fixedWindow(10, '60s'),
});

export async function POST(request: NextRequest) {
    try {
        const ip = request.ip ?? 'ip';
        const keyPrefix = "rlflx-contract-confirm";
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
                try {
                    if (user.offreId) {
                        await prisma.offre_test.update({
                            where: { id: user.offreId! },
                            data: {
                                contract_status: "CONFIRMED"
                            }
                        })
                        return NextResponse.json(
                            {
                                status: 200,
                                message: "L'offre a été confirmer",
                            },
                            {
                                status: 200,
                            }
                        );
                    } else {
                        return NextResponse.json(
                            {
                                status: 400,
                                message: "L'offre rattachée au contrat n'a pas été trouvé, veuillez réessayer",
                            },
                            {
                                status: 400,
                            }
                        );
                    }
                } catch {
                    return NextResponse.json(
                        {
                            status: 400,
                            message: "Erreur lors de la suppression du contrat, veuillez réessayer",
                        },
                        {
                            status: 400,
                        }
                    );
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
        return handleError(error)
    }

}