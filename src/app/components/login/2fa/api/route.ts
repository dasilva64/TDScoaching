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
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip;
  try {
    const rateLimiter = await getRateLimiter(1, 60, "rlflx-login-2fa");
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
    if (!session.id) {
      return NextResponse.json(
        {
          status: 400,
          type: "error",
          message:
            "Erreur lors de la double authentification, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    }
  }
  const { code, pseudo } = (await request.json()) as {
    code: string;
    pseudo: string;
  };
  let arrayMessageError = validationBody({
    code: code,
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
        mail: session.id.trim(),
      },
    });
    if (user) {
      if (code === "") {
        return NextResponse.json(
          {
            status: 400,
            type: "error",
            message:
              "le code n'est pas correct, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        const copy2FAToken = user?.twoFAToken;
        if (code.trim() === copy2FAToken.token.trim()) {
          if (new Date().getTime() > copy2FAToken.limitDate) {
            await prisma.user.update({
              where: { id: session.id },
              data: {
                twoFAToken: Prisma.JsonNull
              }
            })
            return NextResponse.json(
              {
                status: 400,
                type: "resend",
                message:
                  "Le code a expiré, demandez-en un nouveau",
              },
              {
                status: 400,
              })
          } else {
            const editUser = await prisma.user.update({
              where: { id: session.id },
              data: {
                twoFAToken: Prisma.JsonNull
              }
            })
            if (editUser === null) {
              return NextResponse.json(
                {
                  status: 400,
                  type: "error",
                  message:
                    "Impossible de vous connecter, veuillez réessayer",
                },
                {
                  status: 400,
                })
            } else {
              const csrfToken = generateCsrfToken();
              session.role = user.role;
              session.csrfToken = csrfToken;
              session.isLoggedIn = true;
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
              await session.save()
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
                "le code n'est pas correct, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
      }
    } else {
      return NextResponse.json(
        {
          status: 400,
          type: "error",
          message:
            "L'utilisateur n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    }
  }
}
