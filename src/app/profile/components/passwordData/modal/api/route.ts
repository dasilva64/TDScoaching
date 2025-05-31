import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import {
  SessionData,
  sessionOptions,
  defaultSession,
} from "../../../../../lib/session";
import bcrypt from "bcrypt";
import validator from "validator";
import { validationBody } from "../../../../../lib/validation";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import { getRateLimiter } from "@/app/lib/rateLimiter";

export async function POST(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip; // Récupérer l’IP
  try {
    const rateLimiter = await getRateLimiter(5, 60, "rlflx-profile-password");
    await rateLimiter.consume(ip);
  } catch (err) {
    return NextResponse.json(
      {
        status: 429,
        message: "Trop de requêtes, veuillez réessayer plus tard",
      },
      { status: 429 }
    );
  }
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
            id: validator.escape(user.id),
          },
          data: {
            password: validator.escape(encrypt),
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
            message: "Votre mot de passe a été mis à jours avec succès",
            body: userObject,
          });
        }
      }
    }
  }
}
