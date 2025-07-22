import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";
import nodemailer from "nodemailer";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';
import { handleError } from "@/app/lib/handleError";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});


export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
    const keyPrefix = "rlflx-contact";
    const key = `${keyPrefix}:${ip}`
    const { success, remaining } = await ratelimit.limit(key);

    if (!success) {
      return NextResponse.json(
        {
          status: 429,
          message: "Trop de requêtes, veuillez réessayer plus tard",
        },
        { status: 429 }
      );
    }
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
    try {
      const { email, firstname, lastname, object, message, pseudo } =
        await request.json();

      let arrayMessageError = validationBody({
        email: email,
        firstname: firstname,
        lastname: lastname,
        object: object,
        message: message,
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
            message:
              "Une erreur est survenue lors de l'envoie du message, veuillez réessayer plus tard",
          },
          {
            status: 400,
          }
        );
      } else {
        const user = await prisma.user.findUnique({
          where: { mail: email.trim(), status: true },
        });
        let smtpTransport = nodemailer.createTransport({
          host: "smtp.ionos.fr",
          port: 465,
          secure: true,
          auth: {
            user: process.env.SECRET_SMTP_EMAIL,
            pass: process.env.SECRET_SMTP_PASSWORD,
          },
        });
        if (user === null) {
          let mailOptions = {
            from: "contact@tds-coachingdevie.fr",
            to: "contact@tds-coachingdevie.fr",
            subject: object.trim(),
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
                                  <h2 style="text-align: center">${firstname.trim()
              } ${lastname.trim()
              } vous a envoyé un message</h2>
                                  <p style="text-align: left; margin-left: 20px">Email : ${email.trim()
              }</p>
                                  <p style="text-align: left; margin-left: 20px">Compte : l'utilisateur n'est pas inscrit</p>
                                  <p style="text-align: left; margin-left: 20px">Message : ${message.trim()
              }</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
          };
          await smtpTransport.sendMail(mailOptions);
        } else {
          let mailOptions = {
            from: "contact@tds-coachingdevie.fr",
            to: "contact@tds-coachingdevie.fr",
            subject: object.trim(),
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
                                  <h2 style="text-align: center">${firstname.trim()
              } ${lastname.trim()
              } vous a envoyé un message</h2>
                                  <p style="text-align: left; margin-left: 20px">Email : ${email.trim()
              }</p>
                                  <p style="text-align: left; margin-left: 20px">Compte : l'utilisateur est inscrit</p>
                                  <p style="text-align: left; margin-left: 20px">Message : ${message.trim()
              }</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
          };
          await smtpTransport.sendMail(mailOptions);
        }
        let mailOptions = {
          from: "contact@tds-coachingdevie.fr",
          to: email.trim(),
          subject: object.trim(),
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
                                <h1 style="text-align: center">tds coaching a reçu votre message</h1>
                                <h2 style="text-align: center">Rappel du message</h2>
                                <p style="text-align: left; margin-left: 20px">Email : ${email.trim()
            }</p>
                                <p style="text-align: left; margin-left: 20px">Prénom : ${firstname.trim()
            }</p>
                                <p style="text-align: left; margin-left: 20px">Nom de famille : ${lastname.trim()
            }</p>
                                <p style="text-align: left; margin-left: 20px">Objet : ${object.trim()
            }</p>
                                <p style="text-align: left; margin-left: 20px">Message : ${message.trim()
            }</p>
                              </div>
                            </div>
                          </body>
                        </html>`,
        };
        await smtpTransport.sendMail(mailOptions);
        return NextResponse.json({
          status: 200,
          body: user,
          message:
            "Merci de nous avoir contacté, nous allons vous répondre le plus vite possible",
        });
      }
    } catch (err) {
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
    }
  } catch (error) {
    handleError(error)
  }

}
