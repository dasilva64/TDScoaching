import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../../lib/session";
import { validationBody } from "../../../../lib/validation";
import prisma from "../../../../lib/prisma";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { Prisma } from "@prisma/client";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-login-2fa');
  if (rateLimitResponse) return rateLimitResponse;
  const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
  const csrfTokenHeader = headers().get("x-csrf-token");
  const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
  if (csrfCheckResponse) return csrfCheckResponse;
  if (session.isLoggedIn === true) {
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
        id: session.id.trim(),
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
