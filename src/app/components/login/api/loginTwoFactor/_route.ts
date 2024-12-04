/* import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
  sessionOptionsRemeber,
} from "../../../../lib/session";
import { validationBody } from "../../../../lib/validation";
import validator from "validator";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import prisma from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { email, password, pseudo, remember, code } =
    (await request.json()) as {
      email: string;
      password: string;
      pseudo: string;
      remember: boolean;
      code: string;
    };
  let arrayMessageError = validationBody({ email: email, password: password });
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
        message: "Vous ne pouvez pas vous connecter, veuillez réessayer",
      },
      { status: 400 }
    );
  } else {
    const user = await prisma.user.findUnique({
      where: {
        mail: validator.escape(email),
      },
    });
    if (user) {
      const decode = await bcrypt.compare(
        validator.escape(password),
        user.password
      );
      if (decode === false) {
        return NextResponse.json(
          {
            status: 404,
            message:
              "Mauvaise combinaison email/mot de passe, veuillez réessayer",
          },
          { status: 404 }
        );
      } else {
        if (user.twoFactor === true) {
          let copyTwoFactorCode: any = user.twoFactorCode;
          if (Number(copyTwoFactorCode.token) === Number(code)) {
            let current = new Date();
            if (current.getTime() > copyTwoFactorCode.limitDate) {
              return NextResponse.json(
                {
                  status: 404,
                  message: "Le code n'est plus valide, veuillez réessayer",
                },
                { status: 404 }
              );
            } else {
              let editUser = await prisma.user.update({
                where: {
                  id: validator.escape(user.id),
                },
                data: {
                  twoFactorCode: Prisma.JsonNull,
                },
              });
              if (editUser === null) {
                return NextResponse.json(
                  {
                    status: 404,
                    message:
                      "L'utilisateur n'as pas pu être modifié, veuillez réessayer",
                  },
                  { status: 404 }
                );
              } else {
                let userObject = {
                  role: user.role,
                  id: user.id,
                };
                if (remember === true) {
                  const session = await getIronSession<SessionData>(
                    cookies(),
                    sessionOptionsRemeber
                  );
                  session.isLoggedIn = true;
                  session.id = user.id;
                  session.role = user.role;
                  await session.save();
                } else {
                  const session = await getIronSession<SessionData>(
                    cookies(),
                    sessionOptions
                  );
                  session.isLoggedIn = true;
                  session.id = user.id;
                  session.role = user.role;
                  await session.save();
                }
                return NextResponse.json({
                  status: 200,
                  body: userObject,
                  message: `Bonjour, ${validator.escape(user.firstname)} vous êtes maintenant connecté`,
                });
              }
            }
          } else {
            return NextResponse.json(
              {
                status: 404,
                message: "Le code n'est pas correct, veuillez réessayer",
              },
              { status: 404 }
            );
          }
        } else {
          return NextResponse.json(
            {
              status: 404,
              message:
                "Vous n'avez pas l'authentification à deux facteurs d'activé, veuillez réessayer",
            },
            { status: 404 }
          );
        }
      }
    } else {
      return NextResponse.json(
        {
          status: 404,
          message:
            "Mauvaise combinaison email/mot de passe, veuillez réessayer",
        },
        { status: 404 }
      );
    }
  }
}
 */