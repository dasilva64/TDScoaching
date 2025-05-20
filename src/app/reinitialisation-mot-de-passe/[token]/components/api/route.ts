import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { validationBody } from "../../../../lib/validation";
import { Prisma } from "@prisma/client";
import { RateLimiter } from "limiter";

const limiter = new RateLimiter({
  tokensPerInterval: 1,
  interval: 5000,
  fireImmediately: true,
});

export async function POST(request: NextRequest) {
  const remainingRequests = await limiter.removeTokens(1);
  if (remainingRequests < 0) {
    return NextResponse.json(
      {
        status: 429,
        type: "error",
        message: "Trop de requêtes successives, veuillez réessayer plus tard",
      },
      {
        status: 429,
      }
    );
  } else {
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
        {
          status: 400,
        }
      );
    }
    if (pseudo.trim() !== "") {
      return NextResponse.json(
        {
          status: 400,
          type: "error",
          message:
            "Vous ne pouvez pas modifier votre mot de passe, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    } else {
      token
        .trim()
        .split(".")
        .map((t) => {
          t.split("").map((r) => {
            if (r === "<" || r === ">") {
              return NextResponse.json(
                {
                  status: 400,
                  message: "La requête n'est pas valide, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }
          });
        });
      let split = token.trim().split(".");
      if (
        split[0].length === 36 &&
        split[1].length > 0 &&
        split[2].length === 43 &&
        split.length === 3
      ) {
        const { verify } = jwt;
        try {
          const decodeToken: any = verify(
            validator.escape(token.trim()),
            process.env.SECRET_TOKEN_RESET as string
          );
          let user = await prisma.user.findUnique({
            where: { mail: validator.escape(decodeToken.user) },
          });
          if (user === null) {
            return NextResponse.json(
              {
                status: 404,
                message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
              },
              {
                status: 404,
              }
            );
          } else {
            if (user.resetToken === null) {
              return NextResponse.json(
                {
                  status: 404,
                  message:
                    "Aucune demande de réinitialisation de mot de passe n'a été faite, veuillez réessayer",
                },
                {
                  status: 404,
                }
              );
            } else {
              let copyResetToken: any = user.resetToken;
              if (token === copyResetToken.token) {
                if (new Date().getTime() > copyResetToken.limitDate) {
                  const deleteResetToken = await prisma.user.update({
                    where: { mail: validator.escape(user.mail) },
                    data: { resetToken: Prisma.DbNull },
                  });
                  return NextResponse.json(
                    {
                      status: 404,
                      message:
                        "Le lien de réinitialisation n'est plus valide, veuillez réessayer",
                    },
                    {
                      status: 404,
                    }
                  );
                } else {
                  if (password !== passwordConfirm) {
                    return NextResponse.json(
                      {
                        status: 400,
                        message:
                          "Les mots de passe ne correspondent pas, veuillez réessayer",
                      },
                      {
                        status: 400,
                      }
                    );
                  }
                  let encrypt = await bcrypt.hash(password, 10);
                  let editUser = await prisma.user.update({
                    where: { mail: validator.escape(user.mail) },
                    data: { resetToken: Prisma.DbNull, password: validator.escape(encrypt) },
                  });
                  if (editUser === null) {
                    return NextResponse.json(
                      {
                        status: 404,
                        message:
                          "La modification du mot de passe a échoué, veuillez réessayer",
                      },
                      {
                        status: 404,
                      }
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
                  {
                    status: 404,
                  }
                );
              }
            }
          }
        } catch (error) {
          return NextResponse.json(
            {
              status: 404,
              message:
                "Le lien de réinitialisation n'est pas ou plus valide, veuillez réessayer",
            },
            {
              status: 404,
            }
          );
        }
      } else {
        return NextResponse.json(
          {
            status: 400,
            message: "Le token n'est pas valide, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      }
    }
  }
}
