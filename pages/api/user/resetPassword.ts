import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import validator from "validator";
import { validationBody } from "../../../lib/validation";

export default async function resetPassword(req: any, res: NextApiResponse) {
  if (req.method === "POST") {
    const { token, pseudo, password } = await req.body;
    let arrayMessageError = validationBody(req.body);
    if (arrayMessageError.length > 0) {
      return res.status(400).json({
        status: 400,
        message: arrayMessageError,
      });
    }
    if (pseudo.trim() !== "") {
      return res.status(404).json({
        status: 404,
        message:
          "Une erreur est survenue lors de l'envoie du message, veuillez réessayer plus tard",
      });
    } else {
      const { verify } = jwt;
      try {
        const decodeToken: any = verify(
          validator.escape(token.trim()),
          process.env.SECRET_TOKEN_RESET as string
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
          if (user.resetToken === null) {
            return res.status(404).json({
              status: 404,
              message:
                "Le lien de réinitialisation n'est plus valide, veuillez réessayer",
            });
          } else {
            let copyResetToken: any = user.resetToken;
            if (token === copyResetToken.token) {
              if (new Date().getTime() > copyResetToken.limitDate) {
                const deleteResetToken = await prisma.user.update({
                  where: { mail: user.mail },
                  data: { resetToken: Prisma.JsonNull },
                });
                return res.status(404).json({
                  status: 404,
                  message:
                    "Le lien de réinitialisation n'est plus valide, veuillez réessayer",
                });
              } else {
                let encrypt = await bcrypt.hash(password, 10);
                let editUser = await prisma.user.update({
                  where: { mail: user.mail },
                  data: { resetToken: Prisma.JsonNull, password: encrypt },
                });
                res.status(200).json({
                  status: 200,
                  message:
                    "Votre mot de passe a été modifié, vous pouvez maintenant vous connecter",
                });
              }
            } else {
              return res.status(404).json({
                status: 404,
                message:
                  "Le lien de réinitialisation n'est plus valide, veuillez réessayer",
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
        return res.status(404).json({
          status: 404,
          message:
            "Le lien de réinitialisation n'est pas valide, veuillez réessayer",
        });
      }
    }
  } else {
    return res.status(404).json({
      status: 404,
      message: "Une erreur est survenue, veuillez réessayer",
    });
  }
}
