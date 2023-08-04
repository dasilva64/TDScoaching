import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function getuser(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
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
          const { start } = await req.body;
          if (user.role === "ROLE_ADMIN") {
            const meeting = await prisma.meeting.findFirst({
              where: { startAt: start },
            });
            const deleteMeeting = await prisma.meeting.delete({
              where: { id: meeting?.id },
            });
            const allMeeting = await prisma.meeting.findMany({
              where: { startAt: { gte: new Date() } },
              include: {
                User: {
                  select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                  },
                },
              },
            });

            return res.status(200).json({
              status: 200,
              message: "Rendez-vous supprimé avec succès",
              body: allMeeting,
            });
          } else {
            const deleteMeetingInUser = await prisma.user.update({
              where: { id: user.id },
              data: { meetingId: null },
            });
            const meeting = await prisma.meeting.findFirst({
              where: { startAt: start },
            });
            const deleteMeeting = await prisma.meeting.delete({
              where: { id: meeting?.id },
            });

            return res.status(200).json({
              status: 200,
              message: "Rendez-vous supprimé avec succès",
            });
          }
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        });
      }
      /* const deleteMeetingInUser = await prisma.user.update({
        where: { meetingId: id },
        data: { meetingId: Prisma.JsonNull },
      });
      if (1 === 1) {
        const deleteMeet = await prisma.meeting.delete({ where: { id: id } });
        const getUser = await prisma.user.findUnique({
          where: { mail: req.auth.user },
          include: { meetings: true },
        });
        if (getUser === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          res.status(200).json({
            status: 200,
            user: getUser,
            message: "Rendez-vous supprimé avec succès",
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Le rendez-vous n'a pas été modifié, veuillez réessayer",
        });
      } */
    } else {
      return res.status(404).json({
        status: 404,
        message: "bad request",
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
