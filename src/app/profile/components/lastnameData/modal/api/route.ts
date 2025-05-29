import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import {
  SessionData,
  sessionOptions,
  defaultSession,
} from "../../../../../lib/session";
import validator from "validator";
import { validationBody } from "../../../../../lib/validation";
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
              "Vous ne pouvez pas modifier votre nom de famille, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        let editUser = await prisma.user.update({
          where: {
            id: validator.escape(user.id),
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
          if (session.rememberMe) {
            session.updateConfig({
              ...sessionOptions,
              cookieOptions: {
                ...sessionOptions.cookieOptions,
                maxAge: 60 * 60 * 24 * 30,
              },
            });
          } else {
            session.updateConfig({
              ...sessionOptions,
              cookieOptions: {
                ...sessionOptions.cookieOptions,
                maxAge: undefined,
              },
            });
          }
          await session.save();
          return NextResponse.json({
            status: 200,
            csrfToken: csrfToken,
            message: "Votre nom de famille a été mis à jours avec succès",
            body: userObject,
          });
        }
      }
    }
  }
}
