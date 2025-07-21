import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import {
  SessionData,
  sessionOptions,
} from "../../../../../lib/session";
import bcrypt from "bcrypt";
import { validationBody } from "../../../../../lib/validation";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
    points: 5,
    duration: 60,
    keyPrefix: "rlflx-profile-password"
  });
  if (rateLimitResponse) return rateLimitResponse;
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
          password.trim(),
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
  }catch (error) {
      return handleError(error)
    }
  
}
