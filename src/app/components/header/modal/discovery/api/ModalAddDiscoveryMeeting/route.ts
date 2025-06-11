import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import { getRateLimiter } from "@/app/lib/rateLimiter";
  
export async function POST(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip; // Récupérer l’IP
  try {
    const rateLimiter = await getRateLimiter(5, 60, "rlflx-discovery-meeting");
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
        return NextResponse.json(
            {
              status: 401,
              message: "Accès non autorisé",
            },
            {
              status: 401,
            }
          );
    }
    const { start, typeCoaching, email, firstname, lastname, pseudo } =
      (await request.json()) as {
        start: string;
        typeCoaching: string;
        firstname: string;
        lastname: string;
        email: string;
        pseudo: string;
      };
  
    let arrayMessageError = validationBody({
      start: start,
      typeCoaching: typeCoaching,
      firstname: firstname,
      lastname: lastname,
      email: email,
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
          message:
            "Vous ne pouvez pas modifier votre prénom, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    }
    let user = await prisma.user.findUnique({
      where: {
        mail: email.trim(),
      },
    });
    let lastDiscoveryMeetingByUser = await prisma.meeting_test.findMany({
      take: 1,
      where: {
        userMail: email.trim(),
        type: "discovery",
      },
      orderBy: { startAt: "desc" },
    });
    let lastNotDiscoveryMeetingByUser = await prisma.meeting_test.findMany({
      take: 1,
      where: {
        userMail: email.trim(),
        NOT: {
          type: "discovery",
        },
      },
      orderBy: { startAt: "desc" },
    });
    if (user) {
      if (user.role === "ROLE_ADMIN") {
        return NextResponse.json(
          {
            status: 404,
            message: "Vous ne pouvez pas créer de compte, veuillez réessayer",
          },
          {
            status: 404,
          }
        );
      }
      if (user.meetingId) {
        return NextResponse.json(
          {
            status: 404,
            message: "Vous avez déjà un rendez-vous de prévu",
          },
          {
            status: 404,
          }
        );
      } else if (lastDiscoveryMeetingByUser.length > 0) {
        if (lastDiscoveryMeetingByUser[0].status === "pending") {
          return NextResponse.json(
            {
              status: 404,
              message: "Vous avez déjà un rendez-vous de découverte de prévu",
            },
            {
              status: 404,
            }
          );
        } else if (lastDiscoveryMeetingByUser[0].status === "finish") {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà prit votre rendez-vous de découverte",
            },
            {
              status: 400,
            }
          );
        } else {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Votre rendez-vous de découverte est en cours ou est terminer",
            },
            {
              status: 400,
            }
          );
        }
      } else if (lastNotDiscoveryMeetingByUser.length > 0) {
        if (lastNotDiscoveryMeetingByUser[0].status === "pending") {
          return NextResponse.json(
            {
              status: 404,
              message: "Vous avez déjà un rendez-vous de prévu",
            },
            {
              status: 404,
            }
          );
        } else {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà prit votre rendez-vous de découverte",
            },
            {
              status: 400,
            }
          );
        }
      } else {
        let createMeeting = await prisma.meeting_test.create({
          data: {
            startAt: start.trim(),
            confirm: false,
            status: "pending",
            userMail: email.trim(),
            coaching: typeCoaching.trim(),
            type: "discovery",
          },
        });
        let updateUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            meetingId: createMeeting.id,
          },
        });
        if (createMeeting === null) {
          return NextResponse.json(
            {
              status: 404,
              message: "Impossible de prendre le rendez-vous, veuillez réessayer",
            },
            {
              status: 404,
            }
          );
        } else {
          let token = jwt.sign(
            {
              user: email.trim(),
              start: start.trim(),
              id: createMeeting.id,
            },
            process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
          );
          let updateMeeting = await prisma.meeting_test.update({
            where: { id: createMeeting.id },
            data: {
              token: token,
            },
          });
          let updateUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              meetingId: createMeeting.id,
            },
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
            to: user.mail.trim(),
            subject: "Rendez-vous du " + new Date(createMeeting.startAt).toLocaleString().trim(),
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
                              <h2 style="text-align: center">Votre rendez-vous</h2>
                              <p style="margin-bottom: 20px">Information de votre prochain rendez-vous : </p>
                              <ul>
                              <li>Date: ${new Date(createMeeting.startAt).toLocaleString()}</li>
                              <li>Coaching: ${createMeeting.coaching}</li>
                              </ul>
                              <p style="margin-bottom: 20px">Vous devez le confirmer 24h avant la date du rendez-vous, sinon il sera automatiquement supprimer
                              <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous/${encodeURIComponent(token)}" target="_blank">Confirmer mon rendez-vous</a>
                              <p style="margin-bottom: 20px">Vous pouvez le modifier, supprimer  en cliquant sur le bouton ci dessous</p>
                              <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous/${encodeURIComponent(token)}" target="_blank">Modifier mon rendez-vous</a>
                            </div>
                          </div>
                        </body>
                      </html>`,
          };
          await smtpTransport.sendMail(mailOptions);
          const csrfToken = generateCsrfToken()
      session.csrfToken = csrfToken;
      await session.save();
          return NextResponse.json({
            status: 200,
            csrfToken: csrfToken,
            message:
              "Le rendez-vous a bien été pris et un mail vous a été envoyé",
          });
        }
      }
    } else {
      if (lastDiscoveryMeetingByUser.length > 0) {
        if (lastDiscoveryMeetingByUser[0].status === "pending") {
          return NextResponse.json(
            {
              status: 404,
              message: "Vous avez déjà un rendez-vous de découverte de prévu",
            },
            {
              status: 404,
            }
          );
        } else if (lastDiscoveryMeetingByUser[0].status === "finish") {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà prit votre rendez-vous de découverte",
            },
            {
              status: 400,
            }
          );
        } else {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Votre rendez-vous de découverte est en cours ou est terminer",
            },
            {
              status: 400,
            }
          );
        }
      } else if (lastNotDiscoveryMeetingByUser.length > 0) {
        if (lastNotDiscoveryMeetingByUser[0].status === "pending") {
          return NextResponse.json(
            {
              status: 404,
              message: "Vous avez déjà un rendez-vous de prévu",
            },
            {
              status: 404,
            }
          );
        } else {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà prit votre rendez-vous de découverte",
            },
            {
              status: 400,
            }
          );
        }
      } else {
        let createUser = await prisma.user.create({
          data: {
            firstname: firstname,
            lastname: lastname,
            mail: email,
          },
        });
        let createMeeting = await prisma.meeting_test.create({
          data: {
            startAt: start,
            confirm: false,
            status: "pending",
            userMail: email,
            coaching: typeCoaching,
            type: "discovery",
          },
        });
        let updateUser = await prisma.user.update({
          where: { id: createUser.id },
          data: {
            meetingId: createMeeting.id,
          },
        });
        if (createMeeting === null) {
          return NextResponse.json(
            {
              status: 404,
              message: "Impossible de prendre le rendez-vous, veuillez réessayer",
            },
            {
              status: 404,
            }
          );
        } else {
          let token = jwt.sign(
            {
              user: email.trim(),
              start: start,
              id: createMeeting.id,
            },
            process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
          );
          let update = await prisma.meeting_test.update({
            where: { id: createMeeting.id },
            data: {
              token: token,
            },
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
            to: createUser.mail.trim(),
            subject: "Rendez-vous du " + new Date(createMeeting.startAt).toLocaleString(),
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
                              <h2 style="text-align: center">Votre rendez-vous</h2>
                              <p style="margin-bottom: 20px">Information de votre prochain rendez-vous : </p>
                              <ul>
                              <li>Date: ${new Date(createMeeting.startAt).toLocaleString()}</li>
                              <li>Coaching: ${createMeeting.coaching}</li>
                              </ul>
                              <p style="margin-bottom: 20px">Vous devez le confirmer 24h avant la date du rendez-vous, sinon il sera automatiquement supprimer
                              <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous/${encodeURIComponent(token)}" target="_blank">Confirmer mon rendez-vous</a>
                              <p style="margin-bottom: 20px">Vous pouvez le modifier, supprimer  en cliquant sur le bouton ci dessous</p>
                              <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous/${encodeURIComponent(token)}" target="_blank">Modifier mon rendez-vous</a>
                            </div>
                          </div>
                        </body>
                      </html>`,
          };
          await smtpTransport.sendMail(mailOptions);
          const csrfToken = generateCsrfToken()
      session.csrfToken = csrfToken;
      await session.save();
          return NextResponse.json({
            status: 200,
            csrfToken: csrfToken,
            message:
              "Le rendez-vous a bien été pris et un mail vous a été envoyé",
          });
        }
      }
    }
  }