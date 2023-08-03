import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function emailReSendCode(req, res) {
    if (req.method === "POST") {
      const { token } = await req.body;
      if (token && token.length > 0) {
        const { verify } = jwt;
        const decodeToken: any = verify(
          token,
          process.env.SECRET_TOKEN_REGISTER as string
        );
        let user = await prisma.user.findUnique({
          where: { mail: decodeToken.user },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.registerToken && user.status === false) {
            let copyRegisterToken: any = user?.registerToken;
            if (token === copyRegisterToken.token) {
              if (new Date().getTime() > copyRegisterToken.limitDate) {
                const deleteResetToken = await prisma.user.update({
                  where: { mail: decodeToken.user },
                  data: { registerToken: Prisma.JsonNull },
                });
                const deleteUser = await prisma.user.delete({
                  where: { mail: user.mail },
                });
                return res.status(404).json({
                  status: 404,
                  message:
                    "Le lien de validation de votre est plus valide, vous pouvez un créer un nouveau compte",
                });
              } else {
                if (user.status === false) {
                  let editUser = await prisma.user.update({
                    where: { id: user.id },
                    data: { status: true, registerToken: Prisma.JsonNull },
                  });
                  res.status(200).json({
                    status: 200,
                    message:
                      "Votre compte est activé, vous pouvez maintenant vous connecter",
                  });
                }
              }
            } else {
              return res.status(404).json({
                status: 404,
                message: "Le token n'est pas valide, veuillez réessayer",
                body: user,
              });
            }
          } else {
            res.status(404).json({
              status: 404,
              message:
                "Votre compte est déjà activé, vous pouvez vous connecter",
            });
          }
        }

        /* if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          let copyResetToken: any = user.registerToken;
          if (new Date().getTime() > copyResetToken.limitDate) {
            const deleteResetToken = await prisma.user.update({
                where: { mail: decodeToken.user },
                data: { registerToken: Prisma.JsonNull },
              });
              return res.status(404).json({
                status: 404,
                message:
                  "Le lien de validation de votre est plus valide, veuillez réessayer",
              });
          } else {
            if (user.status === false) {
              let editUser = await prisma.user.update({
                where: { id: user.id },
                data: { status: true, registerToken: Prisma.JsonNull },
              });
              res.status(200).json({
                status: 200,
                message:
                  "Votre compte est activé, vous pouvez maintenant vous connecter",
              });
            } else {
              res.status(404).json({
                status: 404,
                message:
                  "Votre compte est déjà activé, vous pouvez vous connecter",
              });
            }
          }
        } */
      } else {
        return res.status(404).json({
          status: 404,
          message: "Le token n'est pas valide, veuillez réessayer",
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
