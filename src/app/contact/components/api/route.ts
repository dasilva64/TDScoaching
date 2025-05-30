import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";
import validator from "validator";
import nodemailer from "nodemailer";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';


const redisClient = new Redis({ enableOfflineQueue: false });

redisClient.on('error', (err) => {
  console.error("Erreur Redis :", err);
})


const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 1, // Autoriser 5 requêtes
  duration: 60, // Par période de 60 secondes
  blockDuration: 0,
  keyPrefix: 'rlflx-contact',
})

export async function POST(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip; // Récupérer l’IP
  console.log('ip', ip)
  try {
    // Vérification du rate limit
    await rateLimiter.consume(ip);
  } catch (err) {
    console.error("Rate limiter error:", err);
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
        where: { mail: validator.escape(email.trim()), status: true },
      });
      /* let smtpTransport = nodemailer.createTransport({
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
          subject: validator.escape(object.trim()),
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
                                  <h2 style="text-align: center">${validator.escape(
                                    firstname.trim()
                                  )} ${validator.escape(
            lastname.trim()
          )} vous a envoyé un message</h2>
                                  <p style="text-align: left; margin-left: 20px">Email : ${validator.escape(
                                    email.trim()
                                  )}</p>
                                  <p style="text-align: left; margin-left: 20px">Compte : l'utilisateur n'est pas inscrit</p>
                                  <p style="text-align: left; margin-left: 20px">Message : ${validator.escape(
                                    message.trim()
                                  )}</p>
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
          subject: validator.escape(object.trim()),
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
                                  <h2 style="text-align: center">${validator.escape(
                                    firstname.trim()
                                  )} ${validator.escape(
            lastname.trim()
          )} vous a envoyé un message</h2>
                                  <p style="text-align: left; margin-left: 20px">Email : ${validator.escape(
                                    email.trim()
                                  )}</p>
                                  <p style="text-align: left; margin-left: 20px">Compte : l'utilisateur est inscrit</p>
                                  <p style="text-align: left; margin-left: 20px">Message : ${validator.escape(
                                    message.trim()
                                  )}</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
        };
        await smtpTransport.sendMail(mailOptions);
      }
      let mailOptions = {
        from: "contact@tds-coachingdevie.fr",
        to: validator.escape(email.trim()),
        subject: validator.escape(object.trim()),
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
                                <p style="text-align: left; margin-left: 20px">Email : ${validator.escape(
                                  email.trim()
                                )}</p>
                                <p style="text-align: left; margin-left: 20px">Prénom : ${validator.escape(
                                  firstname.trim()
                                )}</p>
                                <p style="text-align: left; margin-left: 20px">Nom de famille : ${validator.escape(
                                  lastname.trim()
                                )}</p>
                                <p style="text-align: left; margin-left: 20px">Objet : ${validator.escape(
                                  object.trim()
                                )}</p>
                                <p style="text-align: left; margin-left: 20px">Message : ${validator.escape(
                                  message.trim()
                                )}</p>
                              </div>
                            </div>
                          </body>
                        </html>`,
      };
      await smtpTransport.sendMail(mailOptions); */
     const csrfToken = generateCsrfToken()
      session.csrfToken = csrfToken;
      await session.save();
      return NextResponse.json({
        status: 200,
        body: user,
        csrfToken: csrfToken,
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
}
