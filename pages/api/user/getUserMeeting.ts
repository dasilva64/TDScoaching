import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import { create } from "domain";

export default withIronSessionApiRoute(
  async function getUserMeeting(req: any, res: NextApiResponse) {
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
          const allMeeting = await prisma.meeting.findMany({
            where: { startAt: { gte: new Date() } },
            select: {
              startAt: true,
            },
          });
          let meeting;
          if (user.meetingId === null) {
            meeting = null;
          } else {
            meeting = await prisma.meeting.findUnique({
              where: {
                id: user.meetingId,
              },
            });
          }
          let userObject = {
            meetings: allMeeting,
            meeting: meeting,
            typeMeeting: user.typeMeeting,
            discovery: user.discovery,
          };
          return res.status(200).json({
            status: 200,
            body: userObject,
          });
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
