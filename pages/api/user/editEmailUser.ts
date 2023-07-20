import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function editEmailUser(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { code } = await req.body;
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          let copyEditEmail: any = user.editEmail;
          if (Number(copyEditEmail.token) === Number(code)) {
            let editUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                mail: copyEditEmail.newEmail,
                editEmail: Prisma.JsonNull,
              },
            });
            res.status(200).json({
              status: 200,
              message: "Votre nouvel email est maintenant actif",
              body: editUser,
            });
          } else {
            res.json({
              status: 400,
              message: "Le code n'est pas correct, veuillez réessayer",
            });
          }
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
