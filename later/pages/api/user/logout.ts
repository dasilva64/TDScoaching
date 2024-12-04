/* import { NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, User, sessionOptions } from "../../../lib/session";

export default withIronSessionApiRoute(
  async function logout(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      if (req.session.user) {
        const session = await getIronSession<SessionData>(
          cookies(),
          sessionOptions
        );
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          req.session.destroy();
          return res.status(200).json({
            status: 200,
            body: null,
            message: "Vous êtes maintenant déconnecté",
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
); */
