import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { validationBody } from "../../../../lib/validation";
import { Prisma } from "@prisma/client";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-reset-password-form');
  if (rateLimitResponse) return rateLimitResponse;
  const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
  const csrfTokenHeader = headers().get("x-csrf-token");
  const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
  if (csrfCheckResponse) return csrfCheckResponse;
  if (session.isLoggedIn === true) {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      return NextResponse.json(
        {
          status: 401,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 401,
        }
      );
    }
    let userObject = {
      role: user.role,
      id: user.id,
    };
    return NextResponse.json(
      {
        status: 400,
        body: userObject,
        message: "Vous êtes déjà connecté",
      },
      {
        status: 400,
      }
    );
  }

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
    if (token === null) {
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

    try {
      const { verify } = jwt;
      const decodeToken: any = verify(token.trim(),
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
          {
            status: 404,
          }
        );
      } else {
        if (user.password === null) {
          return NextResponse.json(
            {
              status: 404,
              message:
                "Aucun mot de passe existe pour ce compte, veuillez vous inscrire",
            },
            {
              status: 404,
            }
          );
        }
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
                where: { mail: user.mail },
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
                where: { mail: user.mail },
                data: { resetToken: Prisma.DbNull, password: encrypt },
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
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json(
          { status: 400, message: "Le token a expiré, veuillez en générer un nouveau." },
          { status: 400 }
        );
      } else if (err.name === "JsonWebTokenError") {
        return NextResponse.json(
          { status: 400, message: "Le token est invalide." },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { status: 400, message: "Une erreur inconnue est survenue." },
          { status: 400 }
        );
      }
    }

  }

}
