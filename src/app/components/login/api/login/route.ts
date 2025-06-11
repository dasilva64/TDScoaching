import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../../lib/session";
import { validationBody } from "../../../../lib/validation";
import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import { getRateLimiter } from "@/app/lib/rateLimiter";

export async function POST(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip;
  try {
    const rateLimiter = await getRateLimiter(5, 60, "rlflx-login");
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

  if (session.isLoggedIn === true) {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
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
    return NextResponse.json(
      {
        status: 200,
        message: "Vous êtes déjà connecté",
      },
      {
        status: 200,
      }
    );
  } else {
    const { email, password, pseudo, remember } = (await request.json()) as {
      email: string;
      password: string;
      pseudo: string;
      remember: boolean;
    };
    let arrayMessageError = validationBody({
      email: email,
      password: password,
      remember: remember
    });
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
          message: "Vous ne pouvez pas vous connecter, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    } else {
      const user: any = await prisma.user.findUnique({
        where: {
          mail: email.trim(),
        },
      });
      if (user) {
        if (user.password === null) {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message:
                "Aucun mot de passe existe pour ce compte, veuillez vous inscrire",
            },
            {
              status: 400,
            }
          );
        }
        const decode: any = await bcrypt.compare(
          password.trim(),
          user.password
        );
        if (decode === false) {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message:
                "Mauvaise combinaison email/mot de passe, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          if (user.status === false && user.registerToken) {
            let copyRegisterToken: any = user?.registerToken;
            if (new Date().getTime() > copyRegisterToken.limitDate) {
              const deleteUser = await prisma.user.delete({
                where: { mail: user.mail },
              });
              return NextResponse.json(
                {
                  status: 400,
                  type: "error",
                  message:
                    "Votre compte a été supprimé car vous ne l'avez pas validé à temps, veuillez vous réinscrire",
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
                message:
                  "Votre compte n'est pas encore validé, veuillez vérifier votre boite mail",
              },
              {
                status: 400,
              }
            );
          } else {
            const csrfToken = generateCsrfToken();

            session.isLoggedIn = true;
            session.id = user.id;
            session.role = user.role;
            session.csrfToken = csrfToken;
            session.rememberMe = remember
            if (remember) {
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
              message: `Bonjour, ${user.firstname} vous êtes maintenant connecté`,
            });
          }
        }
      } else {
        return NextResponse.json(
          {
            status: 400,
            type: "error",
            message:
              "Mauvaise combinaison email/mot de passe, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      }
    }
  }
}
