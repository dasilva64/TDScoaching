import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default withIronSessionApiRoute(
  async function getAll(req: any, res: NextApiResponse) {
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
          /* if (user.role !== "ROLE_ADMIN") {
            return res.status(403).json({
              status: 403,
              message: "Vous n'avez pas accès à cette page, veuillez réessayer",
            });
          } else { */
          const allMeeting = await prisma.meeting.findMany({
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
            body: allMeeting,
            message: "all user found",
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
