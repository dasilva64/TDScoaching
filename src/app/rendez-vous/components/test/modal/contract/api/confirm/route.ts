import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
    try {
        const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-contract-confirm');
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
                        /* const { editOffre } = await prisma.$transaction(async (tx) => {
                            let editOffre = await prisma.offre_test.update({
                                where: { id: user?.offreId! },
                                data: {
                                    contract_status: "CONFIRMED"
                                }
                            })
                            return { editOffre }
                        }) */
                         /*let smtpTransport = nodemailer.createTransport({
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
                            subject: `L'offre ${editOffre.type} a été confirmé`,
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
                                  <h2 style="text-align: center">L'offre a été confirmé</h2>
                                  <p style="margin-bottom: 20px">Votre offre flash :</p>
                                  <ul>
                                    <li>ID de l'offre : ${editOffre.id}</li>
                                    <li>Type de l'offre : ${editOffre.type}</li>
                                    <li>Nom : ${user.firstname} ${user.lastname}</li>
                                    <li>Prix : ${editOffre.type === "unique" ? "100€" : "300€"}</li>
                                    <li>Statut du contrat : ${editOffre.contract_status === "GENERATED_NAME_ONLY" ? "En attente de signature" : editOffre.contract_status === "SIGNED" ? "En attente de confirmation" : "A été signé et confirmé"}</li>
                                  </ul>
                                  <p style="margin-bottom: 20px">Votre contrat personnalisé est disponible et téléchargeable depuis votre espace client sur le site TDS Coaching. Vous pouvez le consulter à tout moment avant ou après la confirmation de votre offre.</p>
                                  <p style="margin-bottom: 20px">Vous pouvez consulter, modifier votre offre en cliquant sur le bouton ci-dessous</p>
                                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Mon rendez-vous</a>
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
                            subject: `[CONFIRMÉ] L'offre ${editOffre.type} a été confirmé par ${user.firstname} ${user.lastname}`,
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
                                <h2 style="text-align: center">Contrat en attente de signature</h2>
                                <p style="margin-bottom: 20px">L'offre de <strong>${user.firstname} ${user.lastname}</strong> (${user.mail}) :</p>
                                <ul>
                                <li>Prénom : ${user.firstname}</li>
                                <li>Nom de famille : ${user.lastname}</li>
                                <li>Email : ${user.mail}</li>
                                <li>ID de l'offre : ${editOffre.id}</li>
                                  <li>Type de l'offre : ${editOffre.type}</li>
                                  <li>Status du contrat : ${editOffre.contract_status}</li>
                                  <li>Prix : ${editOffre.type === "unique" ? "100€" : "300€"}</li>
                                </ul>
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