/* import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { validationBody } from "../../../../../lib/validation";
import validator from "validator";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'


export async function GET() {
    const allMeeting = await prisma.meeting.findMany({
        where: { startAt: { gte: new Date() } },
        select: {
        startAt: true,
        },
    });
    let userObject = {
        meetings: allMeeting,
    };
    return NextResponse.json(
        {
        status: 200,
        body: userObject,
        },
        {
        status: 200,
        }
    );
  }

  export async function POST(request: NextRequest) {
  
    
        const { start, typeCoaching, email, firstname, lastname } = (await request.json()) as {
          start: string;
          typeCoaching: string;
          firstname: string;
          lastname: string;
          email: string;
        };
        
        let arrayMessageError = validationBody({
          start: start,
          typeCoaching: typeCoaching,
          firstname: firstname,
          lastname: lastname,
          email: email
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
        let smtpTransport = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.SECRET_SMTP_EMAIL_TEST,
            pass: process.env.SECRET_SMTP_PASSWORD_TEST,
          },
        });
        let mailOptions = {
          from: "contact@tds-coachingdevie.fr",
          to: validator.escape(email.trim()),
          subject: "Validation de votre compte",
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
                            <p style="margin-bottom: 20px">Pour vous connecter à votre compte, veuillez cliquer sur le lien ci-dessous.</p>
                            <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/email-validation/" target="_blank">Vérifier mon compte</a>
                            <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et votre compte sera supprimé</p>
                          </div>
                        </div>
                      </body>
                    </html>`,
        };
        await smtpTransport.sendMail(mailOptions);
        return NextResponse.json({
          status: 200,
          message: "Le rendez-vous a bien été pris et un mail vous a été envoyé",
        });
        const user = await prisma.user.findUnique({
            where: {mail: validator.escape(email)},
            select: {
                discovery: true,
                mail: true
            }
        })
        if (user) {
            if (user.discovery === true) {
                return NextResponse.json(
                    {
                      status: 400,
                      message: "Vous avez déjà prit un rendez-vous de découverte",
                    },
                    {
                      status: 400,
                    }
                  );
            } else {
              const meeting = await prisma.meetingDiscovery.findUnique({
                where: {
                  userMail: validator.escape(user.mail)
                }
              })
              if (meeting) {
                return NextResponse.json(
                  {
                    status: 400,
                    message: "Vous avez déjà prit un rendez-vous de découverte",
                  },
                  {
                    status: 400,
                  }
                );
              } else {
                let token = jwt.sign(
                  { user: validator.escape(email.trim()) },
                  process.env.SECRET_TOKEN_DISCOVERY_MEETING as string);

                const create = await prisma.meetingDiscovery.create({
                data: {
                  startAt: validator.escape(start),
                  confirm: false,
                  statut: validator.escape("pending"),
                  userMail: validator.escape(email),
                  token: validator.escape(token),
                  coaching: validator.escape(typeCoaching),
                  type: validator.escape("discovery")
                }
              })
              if (create === null) {
                return NextResponse.json(
                  {
                    status: 404,
                    message:
                      "Impossible de prendre le rendez-vous, veuillez réessayer",
                  },
                  {
                    status: 404,
                  }
                );
              } else {
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
                  to: validator.escape(user.mail.trim()),
                  subject: "Validation de votre compte",
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
                                    <p style="margin-bottom: 20px">Pour vous connecter à votre compte, veuillez cliquer sur le lien ci-dessous.</p>
                                    <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/email-validation/" target="_blank">Vérifier mon compte</a>
                                    <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et votre compte sera supprimé</p>
                                  </div>
                                </div>
                              </body>
                            </html>`,
                };
                await smtpTransport.sendMail(mailOptions);
                
                await smtpTransport.sendMail(mailOptions);
                return NextResponse.json({
                  status: 200,
                  message: "Le rendez-vous a bien été pris et un mail vous a été envoyé",
                });
              }
              }
              
            }
        } else {
          const meeting = await prisma.meetingDiscovery.findUnique({
            where: {
              userMail: validator.escape(email)
            }
          })
          if (meeting) {
            return NextResponse.json(
              {
                status: 200,
                message: "user pas trouvé et not good",
              },
              {
                status: 200,
              }
            );
          } else {
            return NextResponse.json(
              {
                status: 200,
                message: "user pas trouvé et good",
              },
              {
                status: 200,
              }
            );
          }
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
            let copyTypeMeeting: any = user.typeMeeting;
            let meeting = await prisma.meeting.create({
              data: {
                startAt: start,
                status: true,
                userId: user.id,
                limitDate: null,
                paymentId: null,
                typeMeeting: {
                  ...copyTypeMeeting,
                  coaching: typeCoaching,
                },
              },
            });
            await prisma.user.update({
              where: { id: user.id },
              data: {
                meetingId: meeting.id,
                typeMeeting: {
                  ...copyTypeMeeting,
                  coaching: typeCoaching,
                },
              },
            });
            return NextResponse.json(
              {
                status: 200,
                message: "Le rendez-vous a bien été pris",
              },
              {
                status: 200,
              }
            );
          }
        }
      } */