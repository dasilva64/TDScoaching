import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import nodemailer from "nodemailer";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});

export async function DELETE(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
    const keyPrefix = "rlflx-meet-cancel";
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
        if (user.meetingId === null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous n'avez pas de rendez-vous à supprimer",
            },
            {
              status: 400,
            }
          );
        } else {
          let meeting = await prisma.meeting_test.findUnique({
            where: { id: user.meetingId },
          });
          if (meeting === null) {
            return NextResponse.json(
              {
                status: 400,
                message:
                  "Le rendez-vous n'as pas été trouvé, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            try {
              const { offre, meeting } = await prisma.$transaction(async (tx) => {
                await prisma.user.update({
                  where: { id: session.id },
                  data: {
                    meetingId: null,
                  },
                });
                let meeting = await prisma.meeting_test.update({
                  where: { id: user?.meetingId! },
                  data: { status: "cancelled" }
                });
                let offre = await prisma.offre_test.update({
                  where: {
                    id: user?.offre_test?.id
                  },
                  data: {
                    currentNumberOfMeeting: null,
                    status: "cancelled"
                  }
                })
                return { offre, meeting }
              })
              const stripe = new Stripe(
                "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f" as string, {
                apiVersion: '2022-11-15',
                typescript: true
              }
              );
              const sessiontest = await stripe.checkout.sessions.retrieve(user.offre_test?.sessionId!);
              if (sessiontest.status === "open") {
                await stripe.checkout.sessions.expire(
                  user.offre_test?.sessionId!
                );
              } else if (sessiontest.status === "complete") {
                const paymentIntentId = sessiontest.payment_intent;
                await stripe.paymentIntents.cancel(paymentIntentId as string);
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
                subject: "Suppression de votre rendez-vous",
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
                                                <h2 style="text-align: center">Suppression de rendez-vous</h2>
                                                <p style="margin-bottom: 20px">Information de votre ancien rendez-vous :</p>
                                                <ul>
                                                <li>ID du rendez-vous : ${meeting.id}</li>
                                                <li>Date : ${new Date(meeting.startAt).toLocaleDateString('fr')}</li>
                                                <li>Heure : ${new Date(meeting.startAt).toLocaleTimeString('fr')}</li>
                                                <li>Type : ${offre.type}</li>
                                                <li>Type de coaching : ${offre.coaching}</li>
                                                <li>Prix : ${offre.type === "flash" ? "300€" : "100€"}</li>
                                                </ul>
                                                <p style="margin-bottom: 20px">Vous pouvez reprende un rendez-vous en cliquant sur le bouton ci-dessous</p>
                                                <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Prende un rendez-vous</a>
                                                <p style="margin-top: 20px">Ce message vous est personnel. Il contient des informations confidentielles concernant votre rendez-vous. Merci de ne pas le transférer sans votre accord.</p>
                                              </div>
                                            </div>
                                          </body>
                                        </html>`,
              };
              await smtpTransport.sendMail(mailOptions);
              /* let mailOptionsAdmin = {
                from: "contact@tds-coachingdevie.fr",
                to: "contact@tds-coachingdevie.fr",
                subject: `[Suppression] Rendez-vous de ${user.firstname} ${user.lastname}`,
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
                                              <div style="; background: aqua; padding: 50px 0px 50px 20px; border-radius: 20px">
                                                <h1 style="text-align: center">tds coaching</h1>
                                                <h2 style="text-align: center">Suppression de rendez-vous</h2>
                                                <p style="margin-bottom: 20px">Information du rendez-vous supprimé :</p>
                                                <ul>
                                                <li>Prénom : ${user.firstname}</li>
                                                <li>Nom de famille : ${user.lastname}</li>
                                                <li>Email : ${user.mail}</li>
                                                <li>ID du rendez-vous : ${meeting.id}</li>
                                                <li>Date : ${new Date(meeting.startAt).toLocaleDateString('fr')}</li>
                                                <li>Heure : ${new Date(meeting.startAt).toLocaleTimeString('fr')}</li>
                                                <li>Type : ${offre.type}</li>
                                                <li>Type de coaching : ${offre.coaching}</li>
                                                <li>Prix : ${offre.type === "flash" ? "300€" : "100€"}</li>
                                                <li>Status : ${meeting.status}</li>
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
                  message: "Le rendez-vous a bien été annulé",
                },
                {
                  status: 200,
                }
              );
            } catch {
              return NextResponse.json(
                {
                  status: 400,
                  message:
                    "Une erreur est survenue lors de l'annulation du rendez-vous, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }


          }
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