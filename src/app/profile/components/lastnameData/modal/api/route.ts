import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../../../lib/prisma";
import {
  SessionData,
  sessionOptions,
  defaultSession,
} from "../../../../../../../lib/session";
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
      { status: 401 }
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
        { status: 404 }
      );
    } else {
      const { lastname, pseudo } = (await request.json()) as {
        lastname: string;
        pseudo: string;
      };
      let arrayMessageError = validationBody({ lastname: lastname });

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
            message:
              "Vous ne pouvez pas modifier votre nom de famille, veuillez réessayer",
          },
          { status: 400 }
        );
      } else {
        let editUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            lastname: validator.escape(lastname.trim()),
          },
        });
        if (editUser === null) {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message:
                "Une erreur est survenue lors de la modification de votre nom de famille, veuillez réessayer",
            },
            { status: 400 }
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
            message: "Votre nom de famille a été mis à jours avec succès",
            body: userObject,
          });
        }
      }
    }
  }
}
