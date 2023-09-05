import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { validationBody } from "../../../lib/validation";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function addFirst(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        let { start, typeCoaching, timeZone } = req.body;
        let arrayMessageError = validationBody(req.body);
        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            message: arrayMessageError,
          });
        }
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.meetingId !== null) {
            return res.status(404).json({
              status: 404,
              message: "Vous avez déjà un rendez-vous de pris",
            });
          } else {
            let split = start.split("T");
            let splitDate = split[0].split("-");
            let splitHour = split[1].split(":");
            let dateStart = new Date(
              Date.UTC(
                splitDate[0],
                splitDate[1] - 1,
                splitDate[2],
                Number(splitHour[0]) + Number(timeZone),
                splitHour[1],
                0,
                0
              )
            );
            let isoDateStart = dateStart.toISOString();

            /* let split = start.split(" ");
            let splitDate = split[0].split("/");
            let splitHour = split[1].split(":");
            let dateStart = new Date(
              Date.UTC(
                splitDate[2],
                splitDate[1] - 1,
                splitDate[0],
                Number(splitHour[0]) + Number(timeZone),
                splitHour[1],
                0,
                0
              )
            );
            let isoDateStart = dateStart.toISOString(); */
            const meeting = await prisma.meeting.findFirst({
              where: {
                startAt: start,
              },
            });
            if (meeting) {
              return res.status(404).json({
                status: 404,
                message: "Ce rendez-vous est déjà pris, veuillez réessayer",
              });
            } else {
              let copyTypeMeeting: any = user.typeMeeting;
              const createMeetingObject: any = {
                startAt: start,
                status: true,
                userId: req.session.user.id,
                limitDate: null,
                paymentId: null,
                typeMeeting: {
                  ...copyTypeMeeting,
                  coaching: typeCoaching,
                },
              };
              const createMeeting = await prisma.meeting.create({
                data: createMeetingObject,
              });
              if (createMeeting === null) {
                return res.status(400).json({
                  status: 400,
                  message:
                    "Une erreur est survenue lors de la création du rendez-vous, veuillez réessayer",
                });
              } else {
                const userEdit = await prisma.user.update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    meetingId: createMeeting.id,
                    typeMeeting: {
                      ...copyTypeMeeting,
                      coaching: typeCoaching,
                    },
                  },
                });

                if (userEdit === null) {
                  return res.status(400).json({
                    status: 400,
                    message:
                      "Une erreur est survenue lors de la création du rendez-vous, veuillez réessayer",
                  });
                } else {
                  let smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                      user: process.env.SECRET_SMTP_EMAIL,
                      pass: process.env.SECRET_SMTP_PASSWORD,
                    },
                  });
                  let mailOptions = {
                    from: process.env.SECRET_SMTP_EMAIL,
                    to: process.env.SECRET_SMTP_EMAIL,
                    subject: `RDV confirmé le ${createMeeting.startAt.toLocaleDateString(
                      "fr-FR",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )} à ${createMeeting.startAt.getHours()}h00`,
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
                                    <img src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
                                  </div>
                                  <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                    <h1 style="text-align: center">tds coaching</h1>
                                    <div style="text-align: center">
                                      <img src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Fcalendarcheck.png&w=750&q=75" width="80px" height="80px" />
                                    </div>
                                    <h2 style="text-align: center">Rendez-vous confirmé</h2>
                                    <div style="width: 280px; margin: 0px auto 30px auto">
                                        <p style="display: flex"><img style="margin-right: 5px" src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Fcalendar.png&w=750&q=75" width="20px" height="20px" />${createMeeting.startAt.toLocaleDateString(
                                          "fr-FR",
                                          {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          }
                                        )}<img style="margin: 0px 5px 0px 30px" src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Ftime.png&w=750&q=75" width="20px" height="20px" />${createMeeting.startAt.getHours()}h00</p>
                                    </div>
                                    <p>Type de rendez-vous : Découverte</p>
                                    <p style="margin: 0px 0px 40px 0px">Type de coaching : ${typeCoaching}</p>
                                    <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white; margin-top: 50px" href="https://testtds2.vercel.app/rendez-vous" target="_blank">Voir le rendez-vous</a>
                                  </div>
                                </div>
                              </body>
                            </html>`,
                  };
                  smtpTransport.sendMail(mailOptions);
                  const allMeeting = await prisma.meeting.findMany({
                    where: { startAt: { gte: new Date() } },
                    select: {
                      startAt: true,
                    },
                  });
                  let userObject = {
                    meeting: createMeeting,
                    meetings: allMeeting,
                    discovery: userEdit.discovery,
                    typeMeeting: userEdit.typeMeeting,
                  };
                  return res.status(200).json({
                    status: 200,
                    message: "Rendez-vous pris avec succès",
                    body: userObject,
                    start: start,
                    new: dateStart,
                    iso: isoDateStart,
                    after: createMeeting.startAt,
                    timeZone: timeZone,
                  });
                }
              }
            }
          }
        }
      } else {
        return res.status(401).json({
          status: 401,
          message: "Vous n'êtes pas connecté",
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        message: "Une erreur est survenue, veuillez réessayer",
      });
    }
  },
  {
    password:
      "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
    cookieName: "test",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
