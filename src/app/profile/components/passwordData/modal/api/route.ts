import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../../../lib/prisma";
import {
  SessionData,
  sessionOptions,
  defaultSession,
} from "../../../../../../../lib/session";
import bcrypt from "bcrypt";
import validator from "validator";
import { validationBody } from "../../../../../../../lib/validation";

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
      const { password, passwordComfirm, pseudo } = (await request.json()) as {
        password: string;
        passwordComfirm: string;
        pseudo: string;
      };
      let arrayMessageError = validationBody({ password: password });

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
        if (password.trim() !== passwordComfirm.trim()) {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message: "Les mots de passe ne sont pas identiques",
            },
            {
              status: 400,
            }
          );
        }
        const saltRounds = 10;
        let encrypt = await bcrypt.hash(
          validator.escape(password.trim()),
          saltRounds
        );
        let editUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: encrypt,
          },
        });
        if (editUser === null) {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message:
                "Une erreur est survenue lors de la modification de votre mot de passe, veuillez réessayer",
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
            message: "Votre mot de passe a été mis à jours avec succès",
            body: userObject,
          });
        }
      }
    }
  }
}
