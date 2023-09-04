import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

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
