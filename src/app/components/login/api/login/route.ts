import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers"
import nodemailer from 'nodemailer';
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
            if (user.isTwoFactorEnabled) {
            session.id = user.id;
            session.csrfToken = csrfToken;
            session.rememberMe = remember
            const expireIn = Date.now() + 5 * 60 * 1000;
            session.expireTwoFa = expireIn
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
            } else {
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
            }

            
            if (user.isTwoFactorEnabled) {
              let token = ""
              let characters = "1234567890"
              for(let i = 0; i<8; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length))
              }
              let currentDate = new Date();
              let twoFATokenObject = {
                token: token,
                limitDate: currentDate.setMinutes(
                  currentDate.getMinutes() + 5
                ),
              };
              const editUser = await prisma.user.update({
                where: {
                  id: user.id
                },
                data: {
                twoFAToken: twoFATokenObject
                }
              })
              /* let smtpTransport = nodemailer.createTransport({
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
                          to: email.trim(),
                          subject: "Code double authentification",
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
                                              <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                            </div>
                                            <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                              <h1 style="text-align: center">tds coaching</h1>
                                              <h2 style="text-align: center">Code double authentification</h2>
                                              <p style="margin-bottom: 20px">Pour vous connecter, veuillez entrer le code ci-dessous.</p>
                                              <p style="width: 100px; margin: auto; padding: 20px; background: white; border-radius: 10px">${token}</p>
                                              <p style="margin-top: 20px">Ce code est valide pendant 5 min, au-delà de ce temps il ne sera plus disponible</p>
                                            </div>
                                          </div>
                                        </body>
                                      </html>`,
                        };
                        await smtpTransport.sendMail(mailOptions); */
              await session.save();
              return NextResponse.json({
                status: 200,
                require2FA: true,
                csrfToken: csrfToken,
                message: `Bonjour, ${user.firstname} veuillez saissir votre code pour votre double authentification`,
              });
            } else {
              await session.save();
              return NextResponse.json({
                require2FA: false,
                status: 200,
                csrfToken: csrfToken,
                message: `Bonjour, ${user.firstname} vous êtes maintenant connecté`,
              });
            }
            
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
