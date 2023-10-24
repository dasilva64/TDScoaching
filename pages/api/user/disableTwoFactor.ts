import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function disableTwoFactor(req, res) {
    if (req.method === "GET") {
      if (req.session.user) {
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          let editUser = await prisma.user.update({
            where: { id: user.id },
            data: { twoFactor: false, twoFactorCode: Prisma.JsonNull },
          });
          if (editUser === null) {
            return res.status(400).json({
              status: 400,
              message:
                "Une erreur est survenue lors de la désactivation de l'authentification à deux facteurs, veuillez réessayer",
            });
          } else {
            let userObject = {
              firstname: editUser.firstname,
              lastname: editUser.lastname,
              email: editUser.mail,
              twoFactor: editUser.twoFactor,
            };
            return res.status(200).json({
              status: 200,
              message:
                "Vous avez désactivé l'authentification à deux facteurs avec succès",
              body: userObject,
            });
          }
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
