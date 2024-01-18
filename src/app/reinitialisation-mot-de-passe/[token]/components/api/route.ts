import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import prisma from "../../../../../../lib/prisma";
import { validationBody } from "../../../../../../lib/validation";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { token, password, pseudo } = (await request.json()) as {
    token: string;
    password: string;
    pseudo: string;
  };

  let arrayMessageError = validationBody({
    token: token,
    password: password,
  });
  if (arrayMessageError.length > 0) {
    return Response.json(
      {
        status: 400,
        type: "validation",
        message: arrayMessageError,
      },
      { status: 400 }
    );
  }
  if (pseudo.trim() !== "") {
    return Response.json(
      {
        status: 400,
        type: "error",
        message: "Vous ne pouvez pas modifier votre prénom, veuillez réessayer",
      },
      { status: 400 }
    );
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
        return Response.json(
          {
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          },
          { status: 404 }
        );
      } else {
        if (user.resetToken === null) {
          return Response.json(
            {
              status: 404,
              message:
                "Le lien de réinitialisation n'est plus valide, veuillez réessayer",
            },
            { status: 404 }
          );
        } else {
          let copyResetToken: any = user.resetToken;
          if (token === copyResetToken.token) {
            if (new Date().getTime() > copyResetToken.limitDate) {
              const deleteResetToken = await prisma.user.update({
                where: { mail: user.mail },
                data: { resetToken: Prisma.JsonNull },
              });
              return Response.json(
                {
                  status: 404,
                  message:
                    "Le lien de réinitialisation n'est plus valide, veuillez réessayer",
                },
                { status: 404 }
              );
            } else {
              let encrypt = await bcrypt.hash(password, 10);
              let editUser = await prisma.user.update({
                where: { mail: user.mail },
                data: { resetToken: Prisma.JsonNull, password: encrypt },
              });
              if (editUser === null) {
                return Response.json(
                  {
                    status: 404,
                    message:
                      "La midification du mot de passe a échoué, veuillez réessayer",
                  },
                  { status: 404 }
                );
              } else {
                return Response.json({
                  status: 200,
                  message:
                    "Votre mot de passe a été modifié, vous pouvez maintenant vous connecter",
                });
              }
            }
          } else {
            return Response.json(
              {
                status: 404,
                message:
                  "Le lien de réinitialisation n'est plus valide, veuillez réessayer",
              },
              { status: 404 }
            );
          }
        }
      }
    } catch (error) {
      return Response.json(
        {
          status: 404,
          message:
            "Le lien de réinitialisation n'est pas valide, veuillez réessayer",
        },
        { status: 404 }
      );
    }
  }
}
