import { NextRequest, NextResponse } from "next/server";
import { validationBody } from "../../../lib/validation";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { SessionData, sessionOptions } from "../../../lib/session";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
 /*  const rateLimitResponse = await checkRateLimit(request, {
    points: 5,
    duration: 60,
    keyPrefix: "rlflx-register"
  });
  if (rateLimitResponse) return rateLimitResponse; */
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
    const { email, password, passwordComfirm, firstname, lastname, pseudo } =
      (await request.json()) as {
        email: string;
        password: string;
        passwordComfirm: string;
        firstname: string;
        lastname: string;
        pseudo: string;
      };

    let arrayMessageError = validationBody({
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
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
          message: "Vous ne pouvez pas vous inscrire, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    } else {
      let userEmail = await prisma.user.findUnique({
        where: { mail: email.trim() },
      });
      if (userEmail === null) {
        if (password.trim() !== passwordComfirm.trim()) {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message: "Les mots de passe ne sont pas identiques",
            },
            {
              status: 400,
            }
          );
        }
        const saltRounds = 10;
        let encrypt = await bcrypt.hash(
          password.trim(),
          saltRounds
        );
        let token = jwt.sign(
          { user: email.trim() },
          process.env.SECRET_TOKEN_REGISTER as string,
          { expiresIn: "30m" }
        );
        let currentDate = new Date();
        let registerTokenObject = {
          token: token,
          limitDate: currentDate.setMinutes(currentDate.getMinutes() + 30),
        };
        let UserCreate = await prisma.user.create({
          data: {
            mail: email.trim(),
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            password: encrypt,
            status: false,
            registerToken: registerTokenObject,
            role: "ROLE_USER",
          },
        });
        const OffreCreate = await prisma.offre_test.create({
          data: {
            type: "discovery",
            userId: UserCreate.id,
            status: "pending"
          }
        })
        const UserEdit = await prisma.user.update({
          where: { id: UserCreate.id },
          data: { offreId: OffreCreate.id }
        })

        if (UserCreate === null) {
          return NextResponse.json(
            {
              status: 404,
              message:
                "Impossible de créer un utilisateur, veuillez réessayer",
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
            to: email.trim(),
            subject: "Validation de votre compte",
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
                                <h2 style="text-align: center">Validation de votre compte</h2>
                                <p style="margin-bottom: 20px">Pour vous connecter à votre compte, veuillez cliquer sur le lien ci-dessous.</p>
                                <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/email-validation/${encodeURIComponent(token)}" target="_blank">Vérifier mon compte</a>
                                <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et votre compte sera supprimé</p>
                              </div>
                            </div>
                          </body>
                        </html>`,
          };
          await smtpTransport.sendMail(mailOptions);
          return NextResponse.json({
            status: 200,
            message: "Un mail vous a été envoyé pour activer votre compte",
          });
        }
      } else {
        if (userEmail !== null) {
          if (userEmail.status === false && userEmail.registerToken) {
            let copyRegisterToken: any = userEmail?.registerToken;
            if (new Date().getTime() > copyRegisterToken.limitDate) {
              const deleteUser = await prisma.user.delete({
                where: { mail: userEmail.mail },
              });
              const saltRounds = 10;
              let encrypt = await bcrypt.hash(
                password.trim(),
                saltRounds
              );
              let token = jwt.sign(
                { user: email.trim() },
                process.env.SECRET_TOKEN_REGISTER as string,
                { expiresIn: "30m" }
              );
              let currentDate = new Date();
              let registerTokenObject = {
                token: token,
                limitDate: currentDate.setMinutes(
                  currentDate.getMinutes() + 30
                ),
              };
              let UserCreate = await prisma.user.create({
                data: {
                  mail: email.trim(),
                  firstname: firstname.trim(),
                  lastname: lastname.trim(),
                  password: encrypt,
                  status: false,
                  registerToken: registerTokenObject,
                  role: "ROLE_USER",
                },
              });
              const OffreCreate = await prisma.offre_test.create({
                data: {
                  type: "discovery",
                  userId: UserCreate.id,
                   status: "pending"
                }
              })
              const UserEdit = await prisma.user.update({
                where: { id: UserCreate.id },
                data: { offreId: OffreCreate.id }
              })

              if (UserCreate === null) {
                return NextResponse.json(
                  {
                    status: 404,
                    message:
                      "Impossible de créer un utilisateur, veuillez réessayer",
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
                  to: email.trim(),
                  subject: "Validation de votre compte",
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
                                      <h2 style="text-align: center">Validation de votre compte</h2>
                                      <p style="margin-bottom: 20px">Pour vous connecter à votre compte, veuillez cliquer sur le lien ci-dessous.</p>
                                      <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/email-validation/${encodeURIComponent(token)}" target="_blank">Vérifier mon compte</a>
                                      <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et votre compte sera supprimé.</p>
                                    </div>
                                  </div>
                                </body>
                              </html>`,
                };
                await smtpTransport.sendMail(mailOptions);
                return NextResponse.json({
                  status: 200,
                  message:
                    "Un email vous a été envoyé pour activer votre compte",
                });
              }
            } else {
              return NextResponse.json(
                {
                  status: 404,
                  message:
                    "Un utilisateur utilise déjà cet email, veuillez réessayer",
                },
                {
                  status: 404,
                }
              );
            }
          } if (userEmail.status === null) {
            const saltRounds = 10;
            let encrypt = await bcrypt.hash(
              password.trim(),
              saltRounds
            );
            let token = jwt.sign(
              { user: email.trim() },
              process.env.SECRET_TOKEN_REGISTER as string,
              { expiresIn: "30m" }
            );
            let currentDate = new Date();
            let registerTokenObject = {
              token: token,
              limitDate: currentDate.setMinutes(
                currentDate.getMinutes() + 30
              ),
            };
            const editUser = await prisma.user.update({
              where: { mail: userEmail.mail },
              data: {
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                password: encrypt,
                status: false,
                registerToken: registerTokenObject,
                role: "ROLE_USER",
              }
            })
            if (editUser === null) {
              return NextResponse.json(
                {
                  status: 404,
                  message:
                    "Impossible de créer un utilisateur, veuillez réessayer",
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
                to: email.trim(),
                subject: "Validation de votre compte",
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
                                    <h2 style="text-align: center">Validation de votre compte</h2>
                                    <p style="margin-bottom: 20px">Pour vous connecter à votre compte, veuillez cliquer sur le lien ci-dessous.</p>
                                    <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/email-validation/${encodeURIComponent(token)}" target="_blank">Vérifier mon compte</a>
                                    <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et votre compte sera supprimé.</p>
                                  </div>
                                </div>
                              </body>
                            </html>`,
              };
              await smtpTransport.sendMail(mailOptions);
              return NextResponse.json({
                csrfToken: csrfToken,
                status: 200,
                message:
                  "Un email vous a été envoyé pour activer votre compte",
              });
            }
          } else {
            return NextResponse.json(
              {
                status: 404,
                message:
                  "Un utilisateur utilise déjà cet email, veuillez réessayer",
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
                "Un utilisateur utilise déjà cet email, veuillez réessayer",
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
