import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers"
import nodemailer from 'nodemailer';
import { getIronSession } from "iron-session";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-login-2fa-resend');
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
    const { pseudo } = (await request.json()) as {
      pseudo: string;
    };
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
        if (!user.isTwoFactorEnabled) {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Authentification double facteur pas activé, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          let token = ""
          let characters = "1234567890"
          for (let i = 0; i < 8; i++) {
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
            to: user.mail.trim(),
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
          await smtpTransport.sendMail(mailOptions);
          const csrfToken = generateCsrfToken();
          const expireIn = Date.now() + 5 * 60 * 1000;
          session.expireTwoFa = expireIn
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
            requires2FA: true,
            csrfToken: csrfToken,
            message: `Code 2FA renvoyer`,
          });
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
  } catch (error) {
    handleError(error)
  }

}
