/* import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function getUserMeeting(req: any, res: NextApiResponse) {
    if (req.method === "GET") {
      if (req.session.user) {
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          let link = null;
          const allMeeting = await prisma.meeting.findMany({
            where: { startAt: { gte: new Date() } },
            select: {
              startAt: true,
              userId: true,
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
          if (meeting !== null) {
            let current = new Date();
            let meetingDate = new Date(meeting.startAt);
            let dateSendLink = meetingDate.setHours(
              meetingDate.getHours() - 48
            );
            if (current.getTime() > dateSendLink) {
              link = "https://www.google.com/?client=safari&channel=mac_bm";
            } else {
              link = null;
            }
          } else {
            link = null;
          }
          let userObject = {
            meetings: allMeeting,
            meeting: meeting,
            typeMeeting: user.typeMeeting,
            discovery: user.discovery,
            link: link,
          };
          return res.status(200).json({
            status: 200,
            body: userObject,
          });
        }
      } else {
        return res.status(401).json({
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        });
      }
    } else {
      return res.status(405).json({
        status: 405,
        message:
          "La méthode de la requête n'est pas autorisé, veuillez réessayer",
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
 */
