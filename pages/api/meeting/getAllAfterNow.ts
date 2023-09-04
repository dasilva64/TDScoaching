import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default withIronSessionApiRoute(
  async function getAllAfterNow(req: any, res: NextApiResponse) {
    if (req.method === "GET") {
      if (req.session.user) {
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.role !== "ROLE_ADMIN") {
            return res.status(400).json({
              status: 400,
              message: "Vous n'avez pas les droits pour accéder à cette page",
            });
          } else {
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
              message: "all user found",
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
