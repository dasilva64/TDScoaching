import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
 /*  const rateLimitResponse = await checkRateLimit(request, {
    points: 5,
    duration: 60,
    keyPrefix: "rlflx-email-validation"
  });
  if (rateLimitResponse) return rateLimitResponse; */
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
      let decodeToken: any;
      try {
        decodeToken = verify(token.trim(),
          process.env.SECRET_TOKEN_REGISTER as string
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
          if (user.registerToken && user.status === false) {
            let copyRegisterToken: any = user?.registerToken;
            if (token.trim() === copyRegisterToken.token) {
              if (new Date().getTime() > copyRegisterToken.limitDate) {
                const deleteUser = await prisma.user.delete({
                  where: { mail: user.mail },
                });
                return NextResponse.json(
                  {
                    status: 404,
                    message:
                      "Le lien de validation de votre n'est plus valide, vous pouvez créer un nouveau compte",
                  },
                  {
                    status: 404,
                  }
                );
              } else {
                if (user.status === false) {
                  let editUser = await prisma.user.update({
                    where: { id: user.id },
                    data: { status: true, registerToken: Prisma.DbNull },
                  });
                  return NextResponse.json({
                    status: 200,
                    message:
                      "Votre compte est activé, vous pouvez maintenant vous connecter",
                  });
                }
              }
            } else {
              return NextResponse.json(
                {
                  status: 404,
                  message: "Le token n'est pas valide, veuillez réessayer",
                  body: user,
                },
                {
                  status: 404,
                }
              );
            }
          } else {
            return NextResponse.json(
              {
                status: 404,
                message:
                  "Votre compte est déjà activé, vous pouvez vous connecter",
              },
              {
                status: 404,
              }
            );
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
