import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-reset-password');
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
  } else {
    const { token } = (await request.json()) as {
      token: string;
    };
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
    } else {
      const { verify } = jwt;
      try {
        const decodeToken: any = verify(token.trim(),
          process.env.SECRET_TOKEN_RESET as string
        );
        let user = await prisma.user.findUnique({
          where: { mail: decodeToken.user },
        });
        if (user === null) {
          return NextResponse.json(
            {
              status: 400,
              message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
            },
            {
              status: 400,
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
                status: 400,
                message:
                  "Aucune demande de réinitialisation de mot de passe n'a été faite, veuillez réessayer",
              },
              {
                status: 400,
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
                return NextResponse.json({
                  status: 200,
                  csrfToken: csrfToken,
                  body: {
                    limitDate: copyResetToken.limitDate,
                  },
                  message:
                    "Le lien de réinitialisation est valide, vous pouvez modifier votre mot de passe",
                });
              }
            } else {
              return NextResponse.json(
                {
                  status: 400,
                  message:
                    "Le lien de réinitialisation n'est pas valide, veuillez réessayer",
                },
                {
                  status: 400,
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
}