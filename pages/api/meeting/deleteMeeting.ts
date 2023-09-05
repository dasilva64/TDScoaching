import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function deleteMeeting(req: any, res: NextApiResponse) {
    if (req.method === "GET") {
      if (req.session.user) {
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.meetingId) {
            const meeting = await prisma.meeting.findUnique({
              where: { id: user.meetingId },
            });
            if (meeting === null) {
              return res.status(400).json({
                status: 400,
                message:
                  "Le rendez-vous n'a pas été trouvé, veuillez réessayer",
              });
            } else {
              let copyTypeMeeting: any = user.typeMeeting;
              if (
                copyTypeMeeting["type"] === "découverte" ||
                (copyTypeMeeting["type"] === "unique" &&
                  meeting.status === false)
              ) {
                let copyType: any = meeting.typeMeeting;
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
                  subject: `RDV du ${meeting.startAt.toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )} à ${meeting.startAt.getHours()}h00 annulé`,
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
                                    <img src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Fcalendarcancel.png&w=750&q=75" width="80px" height="80px" />
                                  </div>
                                  <h2 style="text-align: center">Rendez-vous annulé</h2>
                                  <div style="width: 280px; margin: 0px auto 30px auto">
                                      <p style="display: flex"><img style="margin-right: 5px" src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Fcalendar.png&w=750&q=75" width="20px" height="20px" />${meeting.startAt.toLocaleDateString(
                                        "fr-FR",
                                        {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        }
                                      )}<img style="margin: 0px 5px 0px 30px" src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Ftime.png&w=750&q=75" width="20px" height="20px" />${meeting.startAt.getHours()}h00</p>
                                  </div>
                                  <p>Type de rendez-vous : ${copyType.type}</p>
                                  <p style="margin: 0px 0px 40px 0px">Type de coaching : ${
                                    copyType.coaching
                                  }</p>
                                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://testtds2.vercel.app/rendez-vous" target="_blank">Prendre un rendez-vous</a>
                                </div>
                              </div>
                            </body>
                          </html>`,
                };
                smtpTransport.sendMail(mailOptions);
                delete copyTypeMeeting["coaching"];
                delete copyTypeMeeting["paymentId"];
                const deleteMeetingInUser = await prisma.user.update({
                  where: { id: user.id },
                  data: {
                    meetingId: null,
                    typeMeeting: {
                      ...copyTypeMeeting,
                    },
                  },
                });
                const deleteMeeting = await prisma.meeting.delete({
                  where: { id: meeting.id },
                });
                const allMeeting = await prisma.meeting.findMany({
                  where: { startAt: { gte: new Date() } },
                  select: {
                    startAt: true,
                  },
                });
                let userObject = {
                  meeting: null,
                  meetings: allMeeting,
                  discovery: deleteMeetingInUser.discovery,
                  typeMeeting: deleteMeetingInUser.typeMeeting,
                };
                return res.status(200).json({
                  status: 200,
                  message: "Rendez-vous supprimé avec succès",
                  body: userObject,
                });
              } else {
                return res.status(200).json({
                  status: 200,
                  message: "En attente de dev",
                });
              }
            }
          } else {
            return res.status(400).json({
              status: 400,
              message: "Le rendez-vous n'a pas été trouvé, veuillez réessayer",
            });
          }
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
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
