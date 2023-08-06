import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function login(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      const { mail, password } = await req.body;
      const user = await prisma.user.findUnique({
        where: {
          mail: mail,
        },
      });
      if (user) {
        const decode = await bcrypt.compare(password, user.password);
        if (decode === false) {
          return res.status(404).json({
            status: 404,
            message:
              "Mauvaise combinaison email/mot de passe, veuillez réessayer",
          });
        } else {
          if (user.status === false) {
            return res.status(404).json({
              status: 404,
              message:
                "Votre compte n'est pas encore validé, veuillez vérifier votre boite mail",
            });
          } else {
            let userObject = {
              role: user.role,
              id: user.id,
            };
            req.session.user = userObject;
            await req.session.save();
            return res.status(200).json({
              status: 200,
              body: userObject,
              message: `Bonjour, ${user.firstname} vous êtes maintenant connecté`,
            });
          }
        }
      } else {
        return res.status(404).json({
          status: 404,
          message:
            "Mauvaise combinaison email/mot de passe, veuillez réessayer",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        message: "Une erreur est survenue, veuillez réessayer",
      });
    }
  },
  async (req, res) => {
    const { remember } = await req.body;
    return {
      password:
        "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
      cookieName: "test",
      cookieOptions: {
        maxAge: remember ? 60 * 60 * 24 * 30 : undefined,
        secure: process.env.NODE_ENV === "production",
      },
    };
  }
);
