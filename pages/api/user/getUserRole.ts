import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function getUserRole(req: any, res: NextApiResponse) {
    if (req.method === "GET") {
      if (req.session.user) {
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
          include: { meetings: true },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          let userObject = {
            id: user.id,
            role: user.role,
          };
          return res.status(200).json({
            status: 200,
            body: userObject,
          });
        }
      }
      return res.status(404).json({
        status: 404,
        body: "user",
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
