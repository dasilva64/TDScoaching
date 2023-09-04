import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { validationBody } from "../../../lib/validation";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function addFirst(req, res) {
    if (req.method === "POST") {
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
                    
                    <div style="width: 100%; height: 600px">
                      <div style="text-align: center">
                        <img src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
                      </div>
                      <div style="text-align: center; background: aqua; padding: 50px 0px">
                        <h1 style="text-align: center">tds coaching</h1>
                        <div style="text-align: center">
                        <img src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Fcalendarcheck.png&w=750&q=75"
                        </div>
                        <h2 style="text-align: center">Rendez-vous confirmé</h2>
                        <p style="text-align: center">Cliquer sur le lien pour valider votre compte</p>
                        <p style="text-align: center">Ce lien est valide pendant 1 jour</p>
                        <p style="text-align: center">Votre compte sera supprimé si vous ne valider pas votre comtpe</p>
                      </div>
                    </div>
                  </body>
                </html>`,
      };
      smtpTransport.sendMail(mailOptions);
      return res.status(200).json({
        status: 200,
        message: "arrayMessageError",
      });
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
            let split = start.split(" ");
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
            let isoDateStart = dateStart.toISOString();
            const meeting = await prisma.meeting.findFirst({
              where: {
                startAt: isoDateStart,
              },
            });
            if (meeting) {
              return res.status(404).json({
                status: 404,
                message: "Ce rendez-vous est déjà pris, veuillez réessayer",
              });
            } else {
              const createMeetingObject: any = {
                startAt: isoDateStart,
                status: true,
                userId: req.session.user.id,
                limitDate: null,
                paymentId: null,
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
                let copyTypeMeeting: any = user.typeMeeting;
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
                    subject: "Validation de votre compte",
                    html: `<div style={{background: "yellow"}}><h1>tds coaching</h1><p>Cliquer sur le lien pour valider votre compte</p><p>Ce lien est valide pendant 1 jour</p><p>Votre compte sera supprimé si vous ne valider pas votre comtpe</p><a href='http://localhost:3000/email-validation/${token}'>Cliquer ici</a></div>`,
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
