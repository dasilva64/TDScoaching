import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import validator from "validator";
import nodemailer from "nodemailer";
import { validationBody } from "../../../../../lib/validation";
import { Prisma } from "@prisma/client";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";

export async function POST(request: NextRequest) {
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
      where: { id: validator.escape(session.id) },
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
      const { email, pseudo } = (await request.json()) as {
        email: string;
        pseudo: string;
      };
      let arrayMessageError = validationBody({ email: email });

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
              "Vous ne pouvez pas modifier votre email, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        if (user.editEmail !== null) {
          let copyEditEmail: any = user.editEmail;
          let now = new Date();
          let editUser = await prisma.user.update({
            where: { mail: validator.escape(user.mail) },
            data: {
              editEmail: Prisma.DbNull,
            },
          });
          if (user.mail === email.trim()) {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Vous ne pouvez pas utiliser la même adresse email, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            let userExist = await prisma.user.findUnique({
              where: { mail: validator.escape(email.trim()) },
            });
            if (userExist === null) {
              let now = new Date();
              let token = ""
              let characters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890?.@&#$,;:!"
              for(let i = 0; i<14; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length))
              }
              /* let min = 10000000;
              let max = 99999999;
              let random = Math.floor(Math.random() * (max - min)) + min; */
              let editUser = await prisma.user.update({
                where: { mail: validator.escape(user.mail) },
                data: {
                  editEmail: {
                    limitDate: now.setMinutes(now.getMinutes() + 30),
                    token: token,
                    newEmail: validator.escape(email.trim()),
                  },
                },
              });
              if (editUser === null) {
                return NextResponse.json(
                  {
                    status: 400,
                    type: "error",
                    message:
                      "Une erreur est survenue lors de la modification de votre adresse email, veuillez réessayer",
                  },
                  {
                    status: 400,
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
                let copyEditEmail: any = editUser.editEmail;
                let mailOptions = {
                  from: "contact@tds-coachingdevie.fr",
                  to: validator.escape(copyEditEmail.newEmail),
                  subject: "Validation de votre nouvelle adresse email",
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
                                      <h2 style="text-align: center">Validation de votre adresse email</h2>
                                      <p style="margin-bottom: 20px">Pour activer cette addresse email, veuillez entrer le code ci-dessous.</p>
                                      <p style="width: 100px; margin: auto; padding: 20px; background: white; border-radius: 10px">${token}</p>
                                      <p style="margin-top: 20px">Le code est valide pendant 1 heure.</p>
                                      
                                    </div>
                                  </div>
                                </body>
                              </html>`,
                };
                await smtpTransport.sendMail(mailOptions);

                let userObject = {
                  firstname: validator.escape(editUser.firstname),
                  lastname: validator.escape(editUser.lastname),
                  email: validator.escape(editUser.mail),
                  newEmail: validator.escape(copyEditEmail.newEmail),
                };
                const csrfToken = generateCsrfToken()
                session.csrfToken = csrfToken;
                await session.save();
                return NextResponse.json({
                  status: 200,
                  body: userObject,
                  csrfToken: csrfToken,
                  message:
                    "Un email vous a été envoyé pour valider votre nouvelle adresse email",
                });
              }
            } else {
              return NextResponse.json(
                {
                  status: 400,
                  type: "error",
                  message:
                    "Un utilisateur utilise déjà cette adresse mail, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }
          }
        }
        if (user.mail === email.trim()) {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message:
                "Vous ne pouvez pas utiliser la même adresse email, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          let userExist = await prisma.user.findUnique({
            where: { mail: validator.escape(email.trim()) },
          });
          if (userExist === null) {
            let now = new Date();

            /* let min = 10000000;
            let max = 99999999;
            let random = Math.floor(Math.random() * (max - min)) + min; */
            let token = ""
              let characters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890?.@&#$,;:!"
              for(let i = 0; i<14; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length))
              }
            let editUser = await prisma.user.update({
              where: { mail: validator.escape(user.mail) },
              data: {
                editEmail: {
                  limitDate: now.setMinutes(now.getMinutes() + 30),
                  token: token,
                  newEmail: validator.escape(email.trim()),
                },
              },
            });
            if (editUser === null) {
              return NextResponse.json(
                {
                  status: 400,
                  type: "error",
                  message:
                    "Une erreur est survenue lors de la modification de votre adresse email, veuillez réessayer",
                },
                {
                  status: 400,
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
              let copyEditEmail: any = editUser.editEmail;
              let mailOptions = {
                from: "contact@tds-coachingdevie.fr",
                to: validator.escape(copyEditEmail.newEmail),
                subject: "Validation de votre nouvelle adresse email",
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
                                  <h2 style="text-align: center">Validation de votre adresse email</h2>
                                  <p style="margin-bottom: 20px">Pour activer cette addresse email, veuillez entrer le code ci-dessous.</p>
                                  <p style="width: 100px; margin: auto; padding: 20px; background: white; border-radius: 10px">${token}</p>
                                  <p style="margin-top: 20px">Le code est valide pendant 1 heure.</p>
                                  
                                </div>
                              </div>
                            </body>
                          </html>`,
              };
              await smtpTransport.sendMail(mailOptions);

              let userObject = {
                firstname: validator.escape(editUser.firstname),
                lastname: validator.escape(editUser.lastname),
                email: validator.escape(editUser.mail),
                newEmail: validator.escape(copyEditEmail.newEmail),
              };

              return NextResponse.json({
                status: 200,
                body: userObject,
                csrfToken: csrfToken,
                message:
                  "Un email vous a été envoyé pour valider votre nouvelle adresse email",
              });
            }
          } else {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Un utilisateur utilise déjà cette adresse mail, veuillez réessayer",
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
}
