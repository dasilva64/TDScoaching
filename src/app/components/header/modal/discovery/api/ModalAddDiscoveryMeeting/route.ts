import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import { checkRateLimitLong } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitLong(request, 'rlflx-discovery-meeting');
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
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
    const { start, typeCoaching, email, firstname, lastname, pseudo, majorInput, cguInput } =
      (await request.json()) as {
        start: string;
        typeCoaching: string;
        firstname: string;
        lastname: string;
        email: string;
        pseudo: string;
        majorInput: boolean;
        cguInput: boolean;
      };

    let arrayMessageError = validationBody({
      start: start,
      typeCoaching: typeCoaching,
      firstname: firstname,
      lastname: lastname,
      email: email,
      majorInput: majorInput,
      cguInput: cguInput
    });
    if (arrayMessageError.length > 0) {
      if (arrayMessageError.length === 1) {
        if (arrayMessageError[0][0] === "unknown_fields") {
          return NextResponse.json(
            {
              status: 400,
              message: arrayMessageError[0][1],
            },
            {
              status: 400,
            }
          );
        }
      }
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
    if (user && user.status === true) {
      let lastDiscoveryByUser = await prisma.offre_test.findMany({
        take: 1,
        where: {
          userId: user?.id,
          type: "discovery"
        },
      })
      if (user.role === "ROLE_ADMIN") {
        return NextResponse.json(
          {
            status: 404,
            message: "Vous ne pouvez pas créer de rendez-vous, veuillez réessayer",
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
            message: "Un rendez-vous est déjà prévu avec cet email",
          },
          {
            status: 404,
          }
        );
      } else if (lastDiscoveryByUser.length > 0) {
        if (lastDiscoveryByUser[0].status === "not_confirmed") {
          return NextResponse.json(
            {
              status: 404,
              message: "Un rendez-vous de découverte est déjà prévu avec cet email",
            },
            {
              status: 404,
            }
          );
        } else if (lastDiscoveryByUser[0].status === "completed") {
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
      } else {
        try {
          const { meeting, offre } = await prisma.$transaction(async (tx) => {
            let meeting = await prisma.meeting_test.create({
              data: {
                startAt: start,
                status: "not_confirmed",
                userMail: email.trim(),
                offreId: user?.offreId,
                numberOfMeeting: "1",
                status_payment: "free"
              },
            });
            let offre = await prisma.offre_test.update({
              where: { id: user?.offreId! },
              data: {
                currentNumberOfMeeting: 1,
                coaching: typeCoaching,
                currentMeetingId: meeting.id,
                hasCard: true
              }
            })
            await prisma.user.update({
              where: { id: user?.id },
              data: {
                meetingId: meeting.id,
              },
            });
            return { meeting, offre }
          })
          let token = jwt.sign(
            {
              user: email.trim(),
              start: start.trim(),
              id: meeting.id,
            },
            process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
          );
          await prisma.meeting_test.update({
            where: { id: meeting.id },
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
            to: user.mail.trim(),
            subject: "Rendez-vous du " + new Date(meeting.startAt).toLocaleString().trim(),
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
                              <li>Type : Découverte</> 
                              <li>Date : ${new Date(meeting.startAt).toLocaleString()}</li>
                              <li>Coaching : ${offre.coaching}</li>
                              </ul>
                              <p style="margin-bottom: 20px">Vous devez le confirmer 16h avant la date du rendez-vous, sinon il sera automatiquement supprimer
                              <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous/${encodeURIComponent(token)}" target="_blank">Confirmer mon rendez-vous</a>
                              <p style="margin-bottom: 20px">Vous pouvez le modifier, supprimer  en cliquant sur le bouton ci dessous</p>
                              <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous/${encodeURIComponent(token)}" target="_blank">Modifier mon rendez-vous</a>
                            </div>
                          </div>
                        </body>
                      </html>`,
          };
          await smtpTransport.sendMail(mailOptions);
          return NextResponse.json({
            status: 200,
            csrfToken: csrfToken,
            message:
              "Le rendez-vous a bien été pris et un mail vous a été envoyé",
          });
        } catch (error) {
          return NextResponse.json(
            {
              status: 404,
              message: "Impossible de prendre le rendez-vous, veuillez réessayer",
            },
            {
              status: 404,
            }
          );
        }
      }
    } else {
      try {
        const { meeting, createUser, offre } = await prisma.$transaction(async (tx) => {
          let createUser = await prisma.user.create({
            data: {
              firstname: firstname,
              lastname: lastname,
              mail: email,
              isMajor: true
            },
          });
          let currentDate = new Date();
          let userAgreements = await prisma.userAgreement.create({
            data: {
              userId: createUser.id,
              acceptedCGUAt: currentDate,
              acceptedCGU: true,
            }
          })
          const OffreCreate = await prisma.offre_test.create({
            data: {
              type: "discovery",
              userId: createUser.id,
              status: "pending",
              hasCard: false,
              currentNumberOfMeeting: 1,
              coaching: typeCoaching,

            }
          })
          let meeting = await prisma.meeting_test.create({
            data: {
              startAt: start,
              status: "not_confirmed",
              userMail: email.trim(),
              offreId: OffreCreate.id,
              numberOfMeeting: "1",
              status_payment: "free",
            },
          });
          let offre = await prisma.offre_test.update({
            where: { id: OffreCreate.id },
            data: {
              currentMeetingId: meeting.id
            }
          })
          await prisma.user.update({
            where: { id: createUser.id },
            data: {
              meetingId: meeting.id,
              offreId: offre.id,
            },
          });
          return { meeting, createUser, offre }
        })
        let token = jwt.sign(
          {
            user: email.trim(),
            start: start,
            id: meeting.id,
          },
          process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
        );
        await prisma.meeting_test.update({
          where: { id: meeting.id },
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
          subject: "Rendez-vous du " + new Date(meeting.startAt).toLocaleString(),
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
                            <li>Type : Découverte</> 
                            <li>Date: ${new Date(meeting.startAt).toLocaleString()}</li>
                            <li>Coaching: ${offre.coaching}</li>
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
        return NextResponse.json({
          status: 200,
          message:
            "Le rendez-vous a bien été pris et un mail vous a été envoyé",
        });
      } catch (error) {
        return NextResponse.json(
          {
            status: 404,
            message: "Impossible de prendre le rendez-vous, veuillez réessayer",
          },
          {
            status: 404,
          }
        );
      }


    }

  } catch (error) {
    return handleError(error)
  }

}