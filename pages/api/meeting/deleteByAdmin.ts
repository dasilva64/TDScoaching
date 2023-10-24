import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import nodemailer from "nodemailer";
import { validationBody } from "../../../lib/validation";

export default withIronSessionApiRoute(
  async function deleteMeeting(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { start } = await req.body;
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
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.role === "ROLE_ADMIN") {
            let dateStart = new Date(start);
            let isoDateStart = dateStart.toISOString();
            const meeting = await prisma.meeting.findFirst({
              where: { startAt: isoDateStart },
            });
            if (meeting === null) {
              return res.status(404).json({
                status: 404,
                message:
                  "Aucun rendez vous n'éxiste à cette date, veuillez réessayer",
              });
            } else {
              if (meeting.userId === user.id) {
                const deleteMeeting = await prisma.meeting.delete({
                  where: { id: meeting.id },
                });
                const allMeeting = await prisma.meeting.findMany({
                  where: { startAt: { gte: new Date() } },
                  include: {
                    User: {
                      select: {
                        firstname: true,
                        lastname: true,
                      },
                    },
                  },
                });
                let copyAllMeeting: any = allMeeting;
                let array: any = [];
                for (let i = 0; i < allMeeting.length; i++) {
                  delete copyAllMeeting[i].paymentId;
                  delete copyAllMeeting[i].limitDate;
                  delete copyAllMeeting[i].id;
                  delete copyAllMeeting[i].status;
                  array.push(copyAllMeeting[i]);
                }
                return res.status(200).json({
                  status: 200,
                  body: array,
                  message: "Rendez-vous supprimer avec succès",
                });
              } else {
                return res.status(404).json({
                  status: 404,
                  message:
                    "Vous ne pouvez pas supprimer le rendez d'un utilisateur, veuillez réessayer",
                });
              }
            }
          } else {
            return res.status(400).json({
              status: 400,
              message: "Vous n'avez pas les droits pour accéder à cette page",
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
