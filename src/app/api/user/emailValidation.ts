import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";

export async function emailValidation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let token = req.query.token;
    if (token && token.length > 0) {
      const decode: any = jwt.decode(token as string);
      if (decode) {
        let email = decode.user;
        let user = await prisma.user.findFirst({ where: { mail: email } });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.status === false) {
            let editUser = await prisma.user.update({
              where: { id: user.id },
              data: { status: true, token: null },
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
      } else {
        return res.status(404).json({
          status: 404,
          message: "Le token n'est pas valide, veuillez réessayer",
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        message: "Le token n'est pas valide, veuillez réessayer",
      });
    }
  }
}
