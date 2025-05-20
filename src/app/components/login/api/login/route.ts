import { NextRequest, NextResponse } from "next/server";
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
import prisma from "../../../../lib/prisma";
import { RateLimiter } from "limiter";

const limiter = new RateLimiter({
  tokensPerInterval: 600,
  interval: "hour",
  fireImmediately: true,
});

export async function POST(request: NextRequest) {
  const remainingRequests = await limiter.removeTokens(1);
  if (remainingRequests < 0) {
    return NextResponse.json(
      {
        status: 429,
        type: "error",
        message: "Trop de requêtes successives, veuillez réessayer plus tard",
      },
      {
        status: 429,
      }
    );
  } else {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    if (session.isLoggedIn === true) {
      let user = await prisma.user.findUnique({
        where: { id: validator.escape(session.id) },
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
      let userObject = {
        role: user.role,
        id: user.id,
      };
      return NextResponse.json(
        {
          status: 200,
          body: userObject,
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
            mail: validator.escape(email.trim()),
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
            validator.escape(password.trim()),
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
                  where: { mail: validator.escape(user.mail) },
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
              
              let userObject = {
                role: user.role,
                id: user.id,
              };
              if (remember === true) {
                const session: any = await getIronSession<SessionData>(
                  cookies(),
                  sessionOptionsRemeber
                );
                session.isLoggedIn = true;
                session.id = user.id;
                session.role = user.role;
                await session.save();
              } else {
                const session: any = await getIronSession<SessionData>(
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
}
