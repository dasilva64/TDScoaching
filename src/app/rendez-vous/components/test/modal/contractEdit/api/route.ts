import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { createClient } from "@supabase/supabase-js";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
    process.env.SUPABASE_BASE_URL_UPLOAD!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // attention : à utiliser seulement côté serveur !
)

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await checkRateLimit(request, {
            points: 5,
            duration: 60,
            keyPrefix: "rlflx-contract-delete"
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
                try {
                    if (user.offreId) {
                        const { error } = await supabase.storage.from('tds').remove(["contrat-" + user.firstname + "-" + user.lastname + "-" + user.id + ".pdf"])
                        await prisma.offre_test.delete({
                            where: { id: user.offreId! }
                        })
                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                offreId: null
                            }
                        })
                        if (error) {
                            return NextResponse.json(
                                {
                                    status: 400,
                                    message: "Erreur lors de la suppression du contrat, veuillez vous connecter",
                                },
                                {
                                    status: 400,
                                }
                            );
                        } else {
                            return NextResponse.json(
                                {
                                    status: 200,
                                    message: "Le précédent contrat a été supprimé",
                                },
                                {
                                    status: 200,
                                }
                            );
                        }
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
    }
    catch (error: any) {
        handleError(error)
    }
}