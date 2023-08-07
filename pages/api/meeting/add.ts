import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";

export default withIronSessionApiRoute(
  async function get(req, res) {
    if (req.session.user) {
      let start = req.body.start;
      let dateStart = new Date(start);
      const meeting = await prisma.meeting.findFirst({
        where: {
          startAt: dateStart,
        },
      });
      if (meeting) {
        return res.status(404).json({
          status: 404,
          message: "Ce rendez-vous est déjà pris, veuillez réessayer",
        });
      } else {
        const createMeeting: any = {
          startAt: req.body.start,
          endAt: new Date(dateStart.setHours(dateStart.getHours() + 1)),
          status: true,
          userId: req.session.user.id,
          limitDate: null,
        };
        const meeting = await prisma.meeting.create({
          data: createMeeting,
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
          message: "Rendez-vous pris avec succès",
          body: allMeeting,
        });
      }
    } else {
      return res.status(401).json({
        status: 401,
        message: "Vous n'êtes pas connecté",
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
