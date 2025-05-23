import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "../../../../lib/session";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
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
        status: 400,
        body: userObject,
        message: "Vous êtes déjà connecté",
      },
      {
        status: 400,
      }
    );
  } else {
    const { token } = (await request.json()) as {
      token: string;
    };
    if (token === null) {
      return NextResponse.json(
        {
          status: 400,
          message: "La requête n'est pas valide, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    } else { 
        const { verify } = jwt;
        let decodeToken: any;
        try {
          decodeToken = verify(token.trim(),
            process.env.SECRET_TOKEN_REGISTER as string
          );
          let user = await prisma.user.findUnique({
            where: { mail: validator.escape(decodeToken.user) },
          });
          if (user === null) {
            return NextResponse.json(
              {
                status: 404,
                message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
              },
              {
                status: 404,
              }
            );
          } else {
            if (user.registerToken && user.status === false) {
              let copyRegisterToken: any = user?.registerToken;
              if (validator.escape(token.trim()) === copyRegisterToken.token) {
                if (new Date().getTime() > copyRegisterToken.limitDate) {
                  const deleteUser = await prisma.user.delete({
                    where: { mail: validator.escape(user.mail) },
                  });
                  return NextResponse.json(
                    {
                      status: 404,
                      message:
                        "Le lien de validation de votre n'est plus valide, vous pouvez créer un nouveau compte",
                    },
                    {
                      status: 404,
                    }
                  );
                } else {
                  if (user.status === false) {
                    let editUser = await prisma.user.update({
                      where: { id: validator.escape(user.id) },
                      data: { status: true, registerToken: Prisma.DbNull },
                    });
                    return NextResponse.json({
                      status: 200,
                      message:
                        "Votre compte est activé, vous pouvez maintenant vous connecter",
                    });
                  }
                }
              } else {
                return NextResponse.json(
                  {
                    status: 404,
                    message: "Le token n'est pas valide, veuillez réessayer",
                    body: user,
                  },
                  {
                    status: 404,
                  }
                );
              }
            } else {
              return NextResponse.json(
                {
                  status: 404,
                  message:
                    "Votre compte est déjà activé, vous pouvez vous connecter",
                },
                {
                  status: 404,
                }
              );
            }
          }
        } catch (err: any) {
          if (err.name === "TokenExpiredError") {
            return NextResponse.json(
              { status: 400, message: "Le token a expiré, veuillez en générer un nouveau." },
              { status: 400 }
            );
          } else if (err.name === "JsonWebTokenError") {
            return NextResponse.json(
              { status: 400, message: "Le token est invalide." },
              { status: 400 }
            );
          } else {
            return NextResponse.json(
              { status: 400, message: "Une erreur inconnue est survenue." },
              { status: 400 }
            );
          }
        }
      } 
    
  }
}
