import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import prisma from "../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { validationBody } from "../../../../lib/validation";
import { Prisma } from "@prisma/client";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const csrfToken = headers().get("x-csrf-token");

  if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
    return NextResponse.json(
      { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
      { status: 403 }
    );
  }
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
      where: { id: validator.escape(session.id) },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(
        {
          status: 404,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 404,
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
        if (Number(copyEditEmail.token) === Number(code)) {
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
              if (copyEditEmail.limitDate > new Date()) {
                let removeEditEmail = await prisma.user.update({
                  where: { id: validator.escape(user.id) },
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
                where: { id: validator.escape(user.id) },
                data: {
                  mail: validator.escape(copyEditEmail.newEmail),
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
                  firstname: validator.escape(editUser.firstname),
                  lastname: validator.escape(editUser.lastname),
                  email: validator.escape(editUser.mail),
                };
                const csrfToken = generateCsrfToken()
                session.csrfToken = csrfToken;
                await session.save();
                return NextResponse.json({
                  status: 200,
                  csrfToken: csrfToken,
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
}
