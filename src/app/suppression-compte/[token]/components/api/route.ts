import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Prisma } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { getRateLimiter } from "@/app/lib/rateLimiter";

export async function POST(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip; // Récupérer l’IP
  try {
    const rateLimiter = await getRateLimiter(5, 60, "rlflx-delete-account");
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
              process.env.SECRET_TOKEN_DELETE as string
            );
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
          let user = await prisma.user.findUnique({
            where: { mail: decodeToken.user },
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
            if (user.deleteToken && user.status === true) {
              let copyDeleteToken: any = user?.deleteToken;
              if (token.trim() === copyDeleteToken.token) {
                if (new Date().getTime() > copyDeleteToken.limitDate) {
                  const deleteToken = await prisma.user.update({
                    where: { id: user.id },
                    data: { deleteToken: Prisma.DbNull },
                  });
                  return NextResponse.json(
                    {
                      status: 404,
                      message:
                        "Le lien de suppression de votre compte est plus valide, veuillez réessayer",
                    },
                    {
                      status: 404,
                    }
                  );
                } else {
                  if (user.meetingId !== null) {
                    return NextResponse.json(
                      {
                        status: 404,
                        message:
                          "Vous ne pouvez pas supprimer votre compte car vous avez un rendez-vous de prévu",
                      },
                      {
                        status: 404,
                      }
                    );
                  } else {
                    let smtpTransport = nodemailer.createTransport({
                      host: "smtp.ionos.fr",
                      port: 465,
                      secure: true,
                      auth: {
                        user: process.env.SECRET_SMTP_EMAIL,
                        pass: process.env.SECRET_SMTP_PASSWORD,
                      },
                    });
                    let mailOptions = {
                      from: "contact@tds-coachingdevie.fr",
                      to: "contact@tds-coachingdevie.fr",
                      subject: "Suppression de compte",
                      html: `<!DOCTYPE html>
                                <html lang="fr">
                                  <head>
                                    <title>tds coaching</title>
                                    <meta charset="UTF-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                                    <title>Document</title>
                                  </head>
                                  <body>
                                    
                                    <div style="width: 100%">
                                      <div style="text-align: center">
                                        <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
                                      </div>
                                      <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                        <h1 style="text-align: center">tds coaching</h1>
                                        <div style="text-align: center">
                                          <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftrash.png&w=750&q=75" width="80px" height="80px" />
                                        </div>
                                        <h2 style="text-align: center">Suppression d'un compte</h2>
                                        <ul style="list-style: none; padding: 0px">
                                          <li style="margin: 0px 0px 10px 0px">Prénom : ${user.firstname}</li>
                                          <li style="margin: 0px 0px 10px 0px">Nom de famille : ${user.lastname}</li>
                                          <li style="margin: 0px 0px 10px 0px">Email : ${user.mail}</li>
                                          <li style="margin: 0px 0px 10px 0px">Raison : ${user.deleteReason}</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </body>
                                </html>`,
                    };
                    await smtpTransport.sendMail(mailOptions);
                    const deleteUser = await prisma.user.delete({
                      where: { id: user.id },
                    });
                    session.destroy();
                    return NextResponse.json({
                      status: 200,
                      message: "Votre compte a bien été supprimé",
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
              NextResponse.json(
                {
                  status: 404,
                  message:
                    "Le lien de suppression de votre compte est plus valide, veuillez réessayer",
                },
                {
                  status: 404,
                }
              );
            }
          }
        
      }
    }
  }
}
