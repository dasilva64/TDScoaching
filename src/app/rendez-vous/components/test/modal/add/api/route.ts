import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import nodemailer from "nodemailer";
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
    const keyPrefix = "rlflx-meet-add";
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
        const { start, typeCoaching, pseudo } = (await request.json()) as {
          start: string;
          typeCoaching: string;
          pseudo: string;
        };
        let arrayMessageError = validationBody({
          start: start,
          typeCoaching: typeCoaching,
        });
        if (arrayMessageError.length > 0) {
          return NextResponse.json(
            {
              status: 400,
              type: "validation",
              message: arrayMessageError,
            },
            {
              status: 400,
            }
          );
        }
        if (pseudo.trim() !== "") {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message: "Vous ne pouvez pas créer un rendez-vous, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        if (user.meetingId !== null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà un rendez-vous de pris",
            },
            {
              status: 400,
            }
          );
        } else {
          let date = new Date(start);
          if (date < new Date()) {
            return NextResponse.json(
              {
                status: 400,
                message: "La date ne peut pas être dans le passé",
              },
              {
                status: 400,
              }
            );
          } else {
            try {
              const { meeting, EditOffer } = await prisma.$transaction(async (tx) => {
                let meeting = await prisma.meeting_test.create({
                  data: {
                    startAt: start,
                    status: "pending",
                    userMail: user?.mail!,
                    offreId: user?.offreId,
                    numberOfMeeting: "1"
                  },
                });
                let EditOffer = await prisma.offre_test.update({
                  where: { id: user?.offreId! },
                  data: {
                    currentNumberOfMeeting: 1,
                    currentMeetingId: meeting.id,
                    coaching: typeCoaching,
                  }
                })
                let EditUser = await prisma.user.update({
                  where: { id: user?.id },
                  data: {
                    meetingId: meeting.id,
                  },
                });
                return { meeting, EditOffer, EditUser };
              });
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
                subject: "Récapitulatif de votre rendez-vous (confirmation requise)",
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
                                <div style="padding-left: 20px; background: aqua; padding: 50px 0px; border-radius: 20px">
                                  <h1 style="text-align: center">tds coaching</h1>
                                  <h2 style="text-align: center">Prise de rendez-vous</h2>
                                  <p style="margin-bottom: 20px">Information de votre prochain rendez-vous :</p>
                                  <ul>
                                  <li>ID du rendez-vous : ${meeting.id}</li>
                                  <li>Date : ${new Date(meeting.startAt).toLocaleDateString('fr')}</li>
                                  <li>Heure : ${new Date(meeting.startAt).toLocaleTimeString('fr')}</li>
                                  <li>Type : Découverte</li>
                                  <li>Type de coaching : ${EditOffer.coaching}</li>
                                  <li>Prix : Gratuit</li>
                                  </ul>
                                  <p style="margin-bottom: 20px">Vous devez confirmer votre rendez-vous 16h avant le début de celui ci</p>
                                  <p style="margin-bottom: 20px">Vous pouvez consulter, confirmer, modifier ou supprimer votre rendez-vous en cliquant sur le bouton ci-dessous</p>
                                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Mon rendez-vous</a>
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
                subject: `[À confirmer] Prise de rendez-vous de ${user.firstname} ${user.lastname}`,
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
                                  <h2 style="text-align: center">Prise de rendez-vous</h2>
                                  <p style="margin-bottom: 20px">Information du rendez-vous :</p>
                                  <ul>
                                  <li>Prénom : ${user.firstname}</li>
                                  <li>Nom de famille : ${user.lastname}</li>
                                  <li>Email : ${user.mail}</li>
                                  <li>ID du rendez-vous : ${meeting.id}</li>
                                  <li>Date : ${new Date(meeting.startAt).toLocaleDateString('fr')}</li>
                                  <li>Heure : ${new Date(meeting.startAt).toLocaleTimeString('fr')}</li>
                                  <li>Type : Découverte</li>
                                  <li>Type de coaching : ${EditOffer.coaching}</li>
                                  <li>Prix : Gratuit</li>
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
                  message: "Le rendez-vous a bien été pris",
                },
                {
                  status: 200,
                }
              );
            } catch {
              return NextResponse.json(
                {
                  status: 400,
                  message: "Un problème est survenue lors de la creation du rendez-vous, veuillez réessayer",
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