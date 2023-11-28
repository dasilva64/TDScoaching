import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";

export default withIronSessionApiRoute(
  async function edit(req: any, res: NextApiResponse) {
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
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.meetingId === null) {
            return res.status(404).json({
              status: 404,
              message: "Vous n'avez pas de rendez-vous, veuillez réessayer",
            });
          } else {
            let dateStart = new Date(start);
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
              const editMetting = await prisma.meeting.update({
                where: { id: user.meetingId },
                data: {
                  startAt: isoDateStart,
                },
              });
              if (editMetting === null) {
                return res.status(400).json({
                  status: 400,
                  message:
                    "Une erreur est survenue lors de la modification du rendez-vous, veuillez réessayer",
                });
              } else {
                let link = null;
                let current = new Date();
                let meetingDate = new Date(editMetting.startAt);
                let dateSendLink = meetingDate.setHours(
                  meetingDate.getHours() - 48
                );
                if (current.getTime() > dateSendLink) {
                  link = "https://www.google.com/?client=safari&channel=mac_bm";
                } else {
                  link = null;
                }
                const allMeeting = await prisma.meeting.findMany({
                  where: { startAt: { gte: new Date() } },
                  select: {
                    startAt: true,
                    userId: true,
                  },
                });
                let userObject = {
                  meeting: editMetting,
                  meetings: allMeeting,
                  discovery: user.discovery,
                  typeMeeting: user.typeMeeting,
                  link: link,
                };
                return res.status(200).json({
                  status: 200,
                  message: "Rendez-vous modifié avec succès",
                  body: userObject,
                });
              }
            }
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
