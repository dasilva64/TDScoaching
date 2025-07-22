import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { validationBody } from "../../../../lib/validation";
import { Prisma } from "@prisma/client";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
    const keyPrefix = "rlflx-profile-email-data";
    const key = `${keyPrefix}:${ip}`
    const { success, remaining } = await ratelimit.limit(key);

    if (!success) {
      return NextResponse.json(
        {
          status: 429,
          message: "Trop de requêtes, veuillez réessayer plus tard",
        },
        { status: 429 }
      );
    }
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
    if (session.isLoggedIn !== true) {
      return NextResponse.json(
        {
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        },
        {
          status: 401,
        }
      );
    } else {
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
      } else {
        const { code, pseudo } = (await request.json()) as {
          code: string;
          pseudo: string;
        };
        let arrayMessageError = validationBody({ code: code });

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
                "Vous ne pouvez pas modifier votre email, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          let copyEditEmail: any = user.editEmail;
          if (copyEditEmail === null) {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Aucune modification d'email n'as été demandée, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          }
          if (copyEditEmail.token.trim() === code.trim()) {
            if (copyEditEmail.newEmail === null) {
              return NextResponse.json(
                {
                  status: 400,
                  type: "error",
                  message:
                    "Une erreur est survenue lors de la modification de votre email, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            } else {
              if (user.mail === copyEditEmail.newEmail) {
                return NextResponse.json(
                  {
                    status: 400,
                    type: "error",
                    message:
                      "Vous ne pouvez pas utiliser la même adresse email, veuillez réessayer",
                  },
                  {
                    status: 400,
                  }
                );
              } else {
                if (new Date() > copyEditEmail.limitDate) {
                  let removeEditEmail = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      editEmail: Prisma.DbNull,
                    },
                  });
                  if (removeEditEmail === null) {
                    return NextResponse.json(
                      {
                        status: 400,
                        type: "error",
                        message:
                          "Une erreur est survenue lors de la modification de votre email, veuillez réessayer",
                      },
                      {
                        status: 400,
                      }
                    );
                  }
                  return NextResponse.json(
                    {
                      status: 400,
                      type: "error",
                      message: "Le code est expiré, veuillez réessayer",
                    },
                    {
                      status: 400,
                    }
                  );
                }
                let editUser = await prisma.user.update({
                  where: { id: user.id },
                  data: {
                    mail: copyEditEmail.newEmail,
                    editEmail: Prisma.DbNull,
                  },
                });
                if (editUser === null) {
                  return NextResponse.json(
                    {
                      status: 400,
                      type: "error",
                      message:
                        "Une erreur est survenue lors de la modification de votre email, veuillez réessayer",
                    },
                    {
                      status: 400,
                    }
                  );
                } else {
                  let userObject = {
                    firstname: editUser.firstname,
                    lastname: editUser.lastname,
                    email: editUser.mail,
                  };
                  return NextResponse.json({
                    status: 200,
                    message: "Votre nouvel email est maintenant actif",
                    body: userObject,
                  });
                }
              }
            }
          } else {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message: "Le code n'est pas correct, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          }
        }
      }
    }
  } catch (error) {
    return handleError(error)
  }

}
