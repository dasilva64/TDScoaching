import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../../../lib/prisma";
import { validationBody } from "../../../../../../lib/validation";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { token, password, passwordConfirm, pseudo } =
    (await request.json()) as {
      token: string;
      password: string;
      passwordConfirm: string;
      pseudo: string;
    };

  let arrayMessageError = validationBody({
    token: token,
    password: password,
  });
  if (arrayMessageError.length > 0) {
    return NextResponse.json(
      {
        status: 400,
        type: "validation",
        message: arrayMessageError,
      },
      { status: 400 }
    );
  }
  if (pseudo.trim() !== "") {
    return NextResponse.json(
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
        return NextResponse.json(
          {
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          },
          { status: 404 }
        );
      } else {
        if (user.resetToken === null) {
          return NextResponse.json(
            {
              status: 404,
              message:
                "Aucune demande de réinitialisation de mot de passe n'a été faite, veuillez réessayer",
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
              return NextResponse.json(
                {
                  status: 404,
                  message:
                    "Le lien de réinitialisation n'est plus valide, veuillez réessayer",
                },
                { status: 404 }
              );
            } else {
              if (password !== passwordConfirm) {
                return NextResponse.json(
                  {
                    status: 400,
                    message:
                      "Les mots de passe ne correspondent pas, veuillez réessayer",
                  },
                  { status: 400 }
                );
              }
              let encrypt = await bcrypt.hash(password, 10);
              let editUser = await prisma.user.update({
                where: { mail: user.mail },
                data: { resetToken: Prisma.JsonNull, password: encrypt },
              });
              if (editUser === null) {
                return NextResponse.json(
                  {
                    status: 404,
                    message:
                      "La midification du mot de passe a échoué, veuillez réessayer",
                  },
                  { status: 404 }
                );
              } else {
                return NextResponse.json({
                  status: 200,
                  message:
                    "Votre mot de passe a été modifié, vous pouvez maintenant vous connecter",
                });
              }
            }
          } else {
            return NextResponse.json(
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
    } catch (error) {
      return NextResponse.json(
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
