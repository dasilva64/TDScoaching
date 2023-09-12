import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function cancelEmail(req: any, res: NextApiResponse) {
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
          const updateUser = await prisma.user.update({
            where: { mail: user.mail },
            data: {
              twoFactorCode: Prisma.JsonNull,
            },
          });
          let userObject = {
            id: updateUser.id,
            role: updateUser.role,
            firstname: updateUser.firstname,
            lastname: updateUser.lastname,
            email: updateUser.mail,
            editEmail: updateUser.editEmail,
          };
          return res.status(200).json({
            status: 200,
            message:
              "Votre demande de modification de double authentification à été annulé",
            body: userObject,
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