import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
    try {
       const rateLimitResponse = await checkRateLimit(request, {
        points: 5,
        duration: 60,
        keyPrefix: "rlflx-profile-twofa"
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
            const { twoFaCheck } = (await request.json()) as {
                twoFaCheck: boolean;
            };
            if (typeof twoFaCheck !== "boolean") {
                return NextResponse.json(
                    {
                        status: 404,
                        message:
                            "Erreur dans le format des données, veuillez réessayer",
                    },
                    {
                        status: 404,
                    }
                );
            }
            if (twoFaCheck) {
                let token = ""
                let now = new Date();
                let characters = "1234567890"
                for (let i = 0; i < 8; i++) {
                    token += characters.charAt(Math.floor(Math.random() * characters.length))
                }
                let editUser = await prisma.user.update({
                    where: { mail: user.mail },
                    data: {
                        twoFAToken: {
                            limitDate: now.setMinutes(now.getMinutes() + 30),
                            token: token,
                        },
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
                }
                let smtpTransport = nodemailer.createTransport({
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
                    subject: "Validation de votre nouvelle adresse email",
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
                                                  <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                                    <h1 style="text-align: center">tds coaching</h1>
                                                    <h2 style="text-align: center">Validation de votre adresse email</h2>
                                                    <p style="margin-bottom: 20px">Pour activer cette addresse email, veuillez entrer le code ci-dessous.</p>
                                                    <p style="width: 100px; margin: auto; padding: 20px; background: white; border-radius: 10px">${token}</p>
                                                    <p style="margin-top: 20px">Le code est valide pendant 30 min.</p>
                                                    
                                                  </div>
                                                </div>
                                              </body>
                                            </html>`,
                };
                await smtpTransport.sendMail(mailOptions);
                return NextResponse.json(
                    {
                        status: 200,
                        twoFaCheck: twoFaCheck,
                        message:
                            "Un code vous a été envoyé pour activé la double authentification",
                    },
                    {
                        status: 200,
                    }
                );
            } else {
                return NextResponse.json(
                    {
                        status: 200,
                        twoFaCheck: twoFaCheck,
                    },
                    {
                        status: 200,
                    }
                );
            }
        }
    } 
    }catch (error) {
        return handleError(error)
      }
    
}