import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import nodemailer from "nodemailer";
import prisma from "../../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../../lib/session";
import { validationBody } from "../../../../../../lib/validation";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

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
                  where: { id: user.id },
                  data: {
                    editEmail: Prisma.JsonNull,
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
                  mail: validator.escape(copyEditEmail.newEmail),
                  editEmail: Prisma.JsonNull,
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
                  twoFactor: editUser.twoFactor,
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
}
