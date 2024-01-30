import { NextRequest, NextResponse } from "next/server";
import { validationBody } from "../../../../../../lib/validation";
import validator from "validator";
import prisma from "../../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Prisma } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "../../../../../../lib/session";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

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
          headers: {
            "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
            Vary: "Origin",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
          },
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
        headers: {
          "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
          Vary: "Origin",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
      }
    );
  } else {
    const { email, pseudo } = (await request.json()) as {
      email: string;
      pseudo: string;
    };

    let arrayMessageError = validationBody({
      email: email,
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
          headers: {
            "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
            Vary: "Origin",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
          },
        }
      );
    }
    if (pseudo.trim() !== "") {
      return NextResponse.json(
        {
          status: 400,
          type: "error",
          message:
            "Vous ne pouvez pas modifier votre prénom, veuillez réessayer",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
            Vary: "Origin",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
          },
        }
      );
    } else {
      const user = await prisma.user.findUnique({
        where: { mail: validator.escape(email.trim()) },
      });
      if (user === null) {
        return NextResponse.json(
          {
            status: 404,
            message:
              "Aucun compte n'est associé à cette adresse email, veuillez réessayer",
          },
          {
            status: 404,
            headers: {
              "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
              Vary: "Origin",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Accept",
            },
          }
        );
      } else {
        if (user.resetToken) {
          let copyResetToken: any = user.resetToken;
          let limitDate = new Date(copyResetToken.limitDate);
          if (new Date() > limitDate) {
            let editUserReset = await prisma.user.update({
              where: { mail: validator.escape(email.trim()) },
              data: { resetToken: Prisma.JsonNull },
            });
            let token = jwt.sign(
              { user: user.mail },
              process.env.SECRET_TOKEN_RESET as string
            );
            let currentDate = new Date();
            let resetTokenObject = {
              token: token,
              limitDate: currentDate.setMinutes(currentDate.getMinutes() + 5),
            };
            let editUser = await prisma.user.update({
              where: { mail: validator.escape(email.trim()) },
              data: { resetToken: resetTokenObject },
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
            let mailOptions = {
              from: "contact@tds-coachingdevie.fr",
              to: editUser.mail,
              subject: "Réinitialisation du mot de passe",
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
                                <h2 style="text-align: center">Réinitialisation de votre mot de passe</h2>
                                <p style="margin-bottom: 20px">Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous.</p>
                                <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/reinitialisation-mot-de-passe/${token}" target="_blank">Vérifier mon compte</a>
                                <p style="margin-top: 20px">Ce lien est valide pendant 5 min, au-delà de ce temps il ne sera plus disponible.</p>
                              </div>
                            </div>
                          </body>
                        </html>`,
            };
            await smtpTransport.sendMail(mailOptions);
            return NextResponse.json(
              {
                status: 200,
                message:
                  "Un email vous a été envoyer pour récupérer votre compte",
              },
              {
                headers: {
                  "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
                  Vary: "Origin",
                  "Access-Control-Allow-Methods":
                    "GET, POST, PUT, DELETE, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type, Accept",
                },
              }
            );
          } else {
            let currentDate = new Date();
            let difference = limitDate.getTime() - currentDate.getTime();
            let differenceDate = new Date(difference);
            return NextResponse.json(
              {
                status: 404,
                type: "reset",
                email: user.mail,
                message: `Un lien de réinitialisation à déjà été envoyé à cette adresse, veuillez réessayer dans ${differenceDate.getMinutes()} minutes`,
              },
              {
                status: 404,
                headers: {
                  "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
                  Vary: "Origin",
                  "Access-Control-Allow-Methods":
                    "GET, POST, PUT, DELETE, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type, Accept",
                },
              }
            );
          }
        } else {
          let token = jwt.sign(
            { user: user.mail },
            process.env.SECRET_TOKEN_RESET as string
          );
          let currentDate = new Date();
          let resetTokenObject = {
            token: token,
            limitDate: currentDate.setMinutes(currentDate.getMinutes() + 5),
          };
          let editUser = await prisma.user.update({
            where: { mail: validator.escape(email.trim()) },
            data: { resetToken: resetTokenObject },
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
          let mailOptions = {
            from: "contact@tds-coachingdevie.fr",
            to: editUser.mail,
            subject: "Réinitialisation du mot de passe",
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
                              <h2 style="text-align: center">Réinitialisation de votre mot de passe</h2>
                              <p style="margin-bottom: 20px">Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous.</p>
                              <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="http://https://tdscoaching.fr/reinitialisation-mot-de-passe/${token}" target="_blank">Vérifier mon compte</a>
                              <p style="margin-top: 20px">Ce lien est valide pendant 5 min, au-delà de ce temps il ne sera plus disponible.</p>
                            </div>
                          </div>
                        </body>
                      </html>`,
          };
          await smtpTransport.sendMail(mailOptions);
          return NextResponse.json(
            {
              status: 200,
              message:
                "Un email vous a été envoyer pour récupérer votre compte",
            },
            {
              headers: {
                "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
                Vary: "Origin",
                "Access-Control-Allow-Methods":
                  "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Accept",
              },
            }
          );
        }
      }
    }
  }
}
