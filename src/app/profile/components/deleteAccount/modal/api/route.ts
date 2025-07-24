import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import prisma from "../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { validationBody } from "../../../../../lib/validation";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-profile-delete-account');
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
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
      } else {
        const { reason, pseudo } = (await request.json()) as {
          reason: string;
          pseudo: string;
        };
        let arrayMessageError = validationBody({ reason: reason });

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
                "Vous ne pouvez pas supprimer votre compte, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          if (user.deleteToken !== null) {
            let copyDeleteToken: any = user.deleteToken;
            let date = new Date();
            if (copyDeleteToken.limitDate < date) {
              let token = jwt.sign(
                { user: user.mail },
                process.env.SECRET_TOKEN_DELETE as string,
                { expiresIn: "30m" }
              );
              let limitDate = new Date();
              limitDate.setMinutes(limitDate.getMinutes() + 30);
              let editUser = await prisma.user.update({
                where: { id: session.id },
                data: {
                  deleteToken: {
                    token: encodeURIComponent(token),
                    limitDate: limitDate.getTime(),
                  },
                  deleteReason: reason.trim(),
                },
              });
              if (editUser === null) {
                return NextResponse.json(
                  {
                    status: 400,
                    type: "error",
                    message:
                      "Une erreur est survenue lors de la modification de votre compte, veuillez réessayer",
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
                let mailOptions = {
                  from: "contact@tds-coachingdevie.fr",
                  to: editUser.mail,
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
                                        <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                      </div>
                                      <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                        <h1 style="text-align: center">tds coaching</h1>
                                        <div style="text-align: center">
                                          <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftrash.png&w=750&q=75" width="80px" height="80px" />
                                        </div>
                                        <h2 style="text-align: center">Suppression de votre compte</h2>
                                        <p style="margin: 0px 40px 0px 40px">Vous avez fait une demande de suppression de compte. En supprimant votre compte vous n'aurai plus accès au rendez-vous passée. Toutes les données qui sont enregistré vous concernant seront supprimé (email, prénom, nom de famille)</p>
                                        <div style="width: 420px; margin: 0px auto 30px auto">
                                          <p style="display: flex"><img style="margin-right: 5px" src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftriangle.png&w=750&q=75" width="20px" height="20px" />Attention vous ne pourrez plus revenir en arrière après cette action.</p>
                                        </div>
                                        <p style="margin: 0px 0px 40px 0px">Pour supprimer votre compte veuillez cliquer sur le bouton ci-dessous.</p>
                                        <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: red; color: white; margin-top: 50px" href="https://tdscoaching.fr/suppression-compte/${encodeURIComponent(token)}" target="_blank">Supprimer votre compte</a>
                                        <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et vous devrez refaire une demande de suppression de compte</p>
                                      </div>
                                    </div>
                                  </body>
                                </html>`,
                };
                await smtpTransport.sendMail(mailOptions);
                return NextResponse.json({
                  status: 200,
                  message:
                    "Un email vous a été envoyé pour supprimer votre compte",
                });
              }
              /* if (user.meetingId === null) {
                let token = jwt.sign(
                  { user: user.mail) },
                  process.env.SECRET_TOKEN_DELETE as string,
                  { expiresIn: "30m" }
                );
                let limitDate = new Date();
                limitDate.setMinutes(limitDate.getMinutes() + 30);
  
                let editUser = await prisma.user.update({
                  where: { id: session.id) },
                  data: {
                    deleteToken: {
                      token: encodeURIComponent(token),
                      limitDate: limitDate.getTime(),
                    },
                    deleteReason: reason.trim()),
                  },
                });
                if (editUser === null) {
                  return NextResponse.json(
                    {
                      status: 400,
                      type: "error",
                      message:
                        "Une erreur est survenue lors de la modification de votre compte, veuillez réessayer",
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
                  let mailOptions = {
                    from: "contact@tds-coachingdevie.fr",
                    to: editUser.mail),
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
                                            <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                          </div>
                                          <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                            <h1 style="text-align: center">tds coaching</h1>
                                            <div style="text-align: center">
                                              <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftrash.png&w=750&q=75" width="80px" height="80px" />
                                            </div>
                                            <h2 style="text-align: center">Suppression de votre compte</h2>
                                            <p style="margin: 0px 40px 0px 40px">Vous avez fait une demande de suppression de compte. En supprimant votre compte vous n'aurai plus accès au rendez-vous passée. Toutes les données qui sont enregistré vous concernant seront supprimé (email, prénom, nom de famille)</p>
                                            <div style="width: 420px; margin: 0px auto 30px auto">
                                              <p style="display: flex"><img style="margin-right: 5px" src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftriangle.png&w=750&q=75" width="20px" height="20px" />Attention vous ne pourrez plus revenir en arrière après cette action.</p>
                                            </div>
                                            <p style="margin: 0px 0px 40px 0px">Pour supprimer votre compte veuillez cliquer sur le bouton ci-dessous.</p>
                                            <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: red; color: white; margin-top: 50px" href="https://tdscoaching.fr/suppression-compte/${encodeURIComponent(token)}" target="_blank">Supprimer votre compte</a>
                                            <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et vous devrez refaire une demande de suppression de compte</p>
                                          </div>
                                        </div>
                                      </body>
                                    </html>`,
                  };
                  await smtpTransport.sendMail(mailOptions);
                  return NextResponse.json({
                    status: 200,
                    message:
                      "Un email vous a été envoyé pour supprimer votre compte",
                  });
                }
              } else {
                return NextResponse.json(
                  {
                    status: 400,
                    type: "error",
                    message:
                      "Vous ne pouvez pas supprimer votre compte car vous avez un rendez-vous de prévu",
                  },
                  {
                    status: 400,
                  }
                );
              } */
            } else {
              let now = new Date();
              let limitDate = new Date(copyDeleteToken.limitDate);
              let diff = limitDate.getTime() - now.getTime();
              let diffMinutes = Math.floor(diff / 60000);
              return NextResponse.json(
                {
                  status: 400,
                  type: "already",
                  message:
                    "Vous avez déjà fait une demande de suppression de compte, veuillez réessayer dans " +
                    diffMinutes +
                    " minutes",
                },
                {
                  status: 400,
                }
              );
            }
          }
          let token = jwt.sign(
            { user: user.mail },
            process.env.SECRET_TOKEN_DELETE as string,
            { expiresIn: "30m" }
          );
          let limitDate = new Date();
          limitDate.setMinutes(limitDate.getMinutes() + 30);

          let editUser = await prisma.user.update({
            where: { id: session.id },
            data: {
              deleteToken: {
                token: token,
                limitDate: limitDate.getTime(),
              },
              deleteReason: reason.trim(),
            },
          });
          if (editUser === null) {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Une erreur est survenue lors de la modification de votre compte, veuillez réessayer",
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
            let mailOptions = {
              from: "contact@tds-coachingdevie.fr",
              to: editUser.mail,
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
                                    <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                  </div>
                                  <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                    <h1 style="text-align: center">tds coaching</h1>
                                    <div style="text-align: center">
                                      <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftrash.png&w=750&q=75" width="80px" height="80px" />
                                    </div>
                                    <h2 style="text-align: center">Suppression de votre compte</h2>
                                    <p style="margin: 0px 40px 0px 40px">Vous avez fait une demande de suppression de compte. En supprimant votre compte vous n'aurai plus accès au rendez-vous passée. Toutes les données qui sont enregistré vous concernant seront supprimé (email, prénom, nom de famille)</p>
                                    <div style="width: 420px; margin: 0px auto 30px auto">
                                      <p style="display: flex"><img style="margin-right: 5px" src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftriangle.png&w=750&q=75" width="20px" height="20px" />Attention vous ne pourrez plus revenir en arrière après cette action.</p>
                                    </div>
                                    <p style="margin: 0px 0px 40px 0px">Pour supprimer votre compte veuillez cliquer sur le bouton ci-dessous.</p>
                                    <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: red; color: white; margin-top: 50px" href="https://tdscoaching.fr/suppression-compte/${encodeURIComponent(token)}" target="_blank">Supprimer votre compte</a>
                                    <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et vous devrez refaire une demande de suppression de compte</p>
                                  </div>
                                </div>
                              </body>
                            </html>`,
            };
            await smtpTransport.sendMail(mailOptions);
            return NextResponse.json({
              status: 200,
              message: "Un email vous a été envoyé pour supprimer votre compte",
            });
          }
          /* if (user.meetingId === null) {
            let token = jwt.sign(
              { user: user.mail },
              process.env.SECRET_TOKEN_DELETE as string,
              { expiresIn: "30m" }
            );
            let limitDate = new Date();
            limitDate.setMinutes(limitDate.getMinutes() + 30);
  
            let editUser = await prisma.user.update({
              where: { id: session.id) },
              data: {
                deleteToken: {
                  token: token,
                  limitDate: limitDate.getTime(),
                },
                deleteReason: reason.trim()),
              },
            });
            if (editUser === null) {
              return NextResponse.json(
                {
                  status: 400,
                  type: "error",
                  message:
                    "Une erreur est survenue lors de la modification de votre compte, veuillez réessayer",
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
              let mailOptions = {
                from: "contact@tds-coachingdevie.fr",
                to: editUser.mail),
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
                                        <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                      </div>
                                      <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                        <h1 style="text-align: center">tds coaching</h1>
                                        <div style="text-align: center">
                                          <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftrash.png&w=750&q=75" width="80px" height="80px" />
                                        </div>
                                        <h2 style="text-align: center">Suppression de votre compte</h2>
                                        <p style="margin: 0px 40px 0px 40px">Vous avez fait une demande de suppression de compte. En supprimant votre compte vous n'aurai plus accès au rendez-vous passée. Toutes les données qui sont enregistré vous concernant seront supprimé (email, prénom, nom de famille)</p>
                                        <div style="width: 420px; margin: 0px auto 30px auto">
                                          <p style="display: flex"><img style="margin-right: 5px" src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Ficone%2Ftriangle.png&w=750&q=75" width="20px" height="20px" />Attention vous ne pourrez plus revenir en arrière après cette action.</p>
                                        </div>
                                        <p style="margin: 0px 0px 40px 0px">Pour supprimer votre compte veuillez cliquer sur le bouton ci-dessous.</p>
                                        <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: red; color: white; margin-top: 50px" href="https://tdscoaching.fr/suppression-compte/${encodeURIComponent(token)}" target="_blank">Supprimer votre compte</a>
                                        <p style="margin-top: 20px">Ce lien est valide pendant 30 min, au-delà de ce temps il ne sera plus disponible et vous devrez refaire une demande de suppression de compte</p>
                                      </div>
                                    </div>
                                  </body>
                                </html>`,
              };
              await smtpTransport.sendMail(mailOptions);
              return NextResponse.json({
                status: 200,
                message: "Un email vous a été envoyé pour supprimer votre compte",
              });
            }
          } else {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Vous ne pouvez pas supprimer votre compte car vous avez un rendez-vous de prévu",
              },
              {
                status: 400,
              }
            );
          } */
        }
      }
    }
  } catch (error) {
    return handleError(error)
  }

}
