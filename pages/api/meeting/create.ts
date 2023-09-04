import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function create(req: any, res: NextApiResponse) {
    if (req.method === "GET") {
      if (req.session.user) {
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.meetingId !== null) {
            let meeting = await prisma.meeting.findUnique({
              where: { id: user.meetingId },
            });
            if (meeting === null) {
              return res.status(404).json({
                status: 404,
                message: "Le rendez-vous n'existe pas, veuillez réessayer",
              });
            } else {
              const editMeeting = await prisma.meeting.update({
                where: { id: meeting.id },
                data: {
                  status: true,
                },
              });
              res.writeHead(302, {
                Location: "http://localhost:3000/rendez-vous",
              });
              res.end();
            }
          } else {
            return res.status(404).json({
              status: 404,
              message: "Aucun rendez vous a été selectionné",
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
