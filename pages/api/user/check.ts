import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function check(req: any, res: NextApiResponse) {
    if (req.method === "GET") {
      if (req.session.user) {
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(200).json({
            status: 400,
            body: null,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          return res.status(200).json({
            status: 200,
            body: {
              id: user.id,
              role: user.role,
            },
          });
        }
      } else {
        return res.status(200).json({
          status: 404,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
          body: null,
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        body: null,
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
