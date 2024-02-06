import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import nodemailer from "nodemailer";
import prisma from "../../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../../lib/session";
import { validationBody } from "../../../../../../lib/validation";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

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
      const { code, pseudo } = (await request.json()) as {
        code: string;
        pseudo: string;
      };
      let arrayMessageError = validationBody({ code: code });

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
        let copyEditEmail: any = user.editEmail;
        if (Number(copyEditEmail.token) === Number(code)) {
          let editUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              mail: validator.escape(copyEditEmail.newEmail),
              editEmail: Prisma.JsonNull,
            },
          });
          if (editUser === null) {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Une erreur est survenue lors de la modification de votre email, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            let userObject = {
              firstname: editUser.firstname,
              lastname: editUser.lastname,
              email: editUser.mail,
              twoFactor: editUser.twoFactor,
            };
            return NextResponse.json({
              status: 200,
              message: "Votre nouvel email est maintenant actif",
              body: userObject,
            });
          }
        } else {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message: "Le code n'est pas correct, veuillez réessayer",
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

export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

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
          status: 404,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 404,
        }
      );
    } else {
      if (user.editEmail) {
        let min = Math.ceil(10000000);
        let max = Math.floor(99999998);
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        let copyEditEmail: any = user.editEmail;
        let editUser = await prisma.user.update({
          where: { mail: user.mail },
          data: {
            editEmail: {
              token: random,
              newEmail: copyEditEmail.newEmail,
            },
          },
        });
        if (editUser === null) {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Une erreur est survenue lors de la modification de votre email, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          let userObject = {
            id: editUser.id,
            role: editUser.role,
            firstname: editUser.firstname,
            lastname: editUser.lastname,
            email: editUser.mail,
            newEmail: copyEditEmail.newEmail,
          };
          let smtpTransport = nodemailer.createTransport({
            host: "smtp.ionos.fr",
            port: 465,
            secure: true,
            auth: {
              user: process.env.SECRET_SMTP_EMAIL,
              pass: process.env.SECRET_SMTP_PASSWORD,
            },
          });
          /*l et smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.SECRET_SMTP_EMAIL_TEST,
              pass: process.env.SECRET_SMTP_PASSWORD_TEST,
            },
          }); */
          let mailOptions = {
            from: "contact@tds-coachingdevie.fr",
            to: copyEditEmail.newEmail,
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
                      <h2 style="text-align: center">Validation de votre nouvelle addresse email</h2>
                      <p style="margin-bottom: 20px">Pour activé votre nouvelle addresse email, veuillez entrer le code ci-dessous.</p>
                      <p style="width: 100px; margin: auto; padding: 20px; background: white; border-radius: 10px">${random}</p>
                    </div>
                  </div>
                </body>
              </html>`,
          };
          await smtpTransport.sendMail(mailOptions);
          return NextResponse.json({
            status: 200,
            body: userObject,
            message:
              "Un code vous à été renvoyé pour valider votre adresse email",
          });
        }
      } else {
        return NextResponse.json(
          {
            status: 400,
            message: "Aucune modification d'email en cours, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      }
    }
  }
}
