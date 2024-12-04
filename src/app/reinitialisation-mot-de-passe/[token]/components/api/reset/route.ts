import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import prisma from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "../../../../../lib/session";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (session.isLoggedIn === true) {
    let user = await prisma.user.findUnique({
      where: { id: validator.escape(session.id) },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(
        {
          status: 400,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 400,
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
      token.split(".").map((t) => {
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
      let split = token.split(".");
      if (
        split[0].length === 36 &&
        split[1].length > 0 &&
        split[2].length === 43 &&
        split.length === 3
      ) {
        const { verify } = jwt;
        try {
          const decodeToken: any = verify(
            validator.escape(token),
            process.env.SECRET_TOKEN_RESET as string
          );
          let user = await prisma.user.findUnique({
            where: { mail: validator.escape(decodeToken.user) },
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
                    where: { mail: validator.escape(user.mail) },
                    data: { resetToken: Prisma.JsonNull },
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
        } catch (error) {
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
//http://localhost:3000/reinitialisation-mot-de-passe/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGhvbWFzZGFzaWx2YTAxMEBnbWFpbC5jb20iLCJpYXQiOjE3MTE0NDM1NDYsImV4cCI6MTcxMTQ0Mzg0Nn0.R9fOtvTs6764jjHdrvyXn6zr1tpNHPoDBS5OH02PKp0
/* split[0].length === 36 &&
        split[1].length === 140 &&
        split[2].length === 43 */
//https://tdscoaching.fr/reinitialisation-mot-de-passe/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiJDJiJDEwJFA1cHNBLklvVGVHbEJVdGpQV1YzMGUwLnZvRHlZSmVGa2NSc3ZYa216V2E2bkNvdDNxOUlLIiwiaWF0IjoxNzExNDQwNjIyLCJleHAiOjE3MTE0NDA2ODJ9.nWyfsCKSLH93ZSvoKJcl4-cVDs9iPReuiaOQzI5Fxa4
