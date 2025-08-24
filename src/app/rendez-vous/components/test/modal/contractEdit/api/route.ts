import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { createClient } from "@supabase/supabase-js";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"

const supabase = createClient(
    process.env.SUPABASE_BASE_URL_UPLOAD!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // attention : à utiliser seulement côté serveur !
)

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-contract-delete');
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
                include: {
                    offre_test: true
                }
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
                        let previousOffre = user.offre_test?.type
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
                             /* let smtpTransport = nodemailer.createTransport({
                                host: "smtp.ionos.fr",
                                port: 465,
                                secure: true,
                                auth: {
                                    user: process.env.SECRET_SMTP_EMAIL,
                                    pass: process.env.SECRET_SMTP_PASSWORD,
                                },
                            });
                            let mailOptions = {
                                from: "contact@tds-coachingdevie.fr",
                                to: user.mail,
                                subject: `Suppression de votre ancien contrat`,
                                html: `<!DOCTYPE html>
                          <html lang="fr">
                            <head>
                              <title>tds coaching</title>
                              <meta charset="UTF-8" />
                              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                              <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                              <title>Document</title>
                            </head>
                            <body>
                              
                              <div style="width: 100%">
                                <div style="text-align: center">
                                  <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                </div>
                                <div style="background: aqua; padding: 50px 0px 50px 20px; border-radius: 20px">
                                  <h1 style="text-align: center">tds coaching</h1>
                                  <h2 style="text-align: center">Annulation du contrat</h2>
                                  <p style="margin-bottom: 20px">Comme vous l'avez souhaité, le contrat initial lié à votre offre <strong>${previousOffre}</strong> a été annulé.</p>
                                  <p style="margin-bottom: 20px">Nous avons remis à zéro le processus de signature afin que vous puissiez générer un nouveau contrat avec les modifications nécessaires.</p>
                                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Mes rendez-vous</a>
                                  <p style="margin-top: 20px">Ce message vous est personnel. Il contient des informations confidentielles concernant votre rendez-vous. Merci de ne pas le transférer sans votre accord.</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
                            };
                            await smtpTransport.sendMail(mailOptions);
                            let mailOptionsAdmin = {
                                from: "contact@tds-coachingdevie.fr",
                                to: "contact@tds-coachingdevie.fr",
                                subject: `[ANNULATION] Annulation du contrat sélectionnée par ${user.firstname} ${user.lastname}`,
                                html: `<!DOCTYPE html>
                        <html lang="fr">
                          <head>
                            <title>tds coaching</title>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                            <title>Document</title>
                          </head>
                          <body>
                            
                            <div style="width: 100%">
                              <div style="text-align: center">
                                <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                              </div>
                              <div style="background: aqua; padding: 50px 0px 50px 20px; border-radius: 20px">
                                <h1 style="text-align: center">tds coaching</h1>
                                <h2 style="text-align: center">Annulation du contrat</h2>
                                <p style="margin-bottom: 20px">L'utilisateur <strong>${user.firstname} ${user.lastname}</strong> (${user.mail}) a remis a zéro son contrat lié a son offre <strong>${previousOffre}</strong></p>
                                <p style="margin-bottom: 20px">Voir la page de l'utilisateur</p>
                                <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/utilisateur/${encodeURI(user.id)}" target="_blank">Page utilisateur</a>
                              </div>
                            </div>
                          </body>
                        </html>`,
                            };
                            await smtpTransport.sendMail(mailOptionsAdmin); */
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
        return handleError(error)
    }
}