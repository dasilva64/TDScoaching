import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default withIronSessionApiRoute(
  async function getuser(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      let user = req.params.email;
      let userOne = await prisma.user.findUnique({ where: { mail: user } });
      if (userOne === null) {
        return res.status(404).json({
          status: 404,
          message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
        });
      } else {
        const allMeetingByUser = await prisma.meeting.findMany({
          where: { userId: userOne.id },
        });
        if (allMeetingByUser === null) {
          return res.status(404).json({
            status: 404,
            message: "Aucun rendez-vous n'a été trouvé pour cet utilisateur",
          });
        } else {
          return res.status(200).json({
            status: 200,
            body: allMeetingByUser,
          });
        }
      }
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
