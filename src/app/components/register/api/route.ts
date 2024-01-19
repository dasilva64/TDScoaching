import { NextRequest, NextResponse } from "next/server";
import { validationBody } from "../../../../../lib/validation";
import validator from "validator";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { email, password, firstname, lastname, pseudo } =
    (await request.json()) as {
      email: string;
      password: string;
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
      { status: 400 }
    );
  }
  if (pseudo.trim() !== "") {
    return NextResponse.json(
      {
        status: 400,
        type: "error",
        message: "Vous ne pouvez pas modifier votre prénom, veuillez réessayer",
      },
      { status: 400 }
    );
  } else {
    let userEmail = await prisma.user.findUnique({
      where: { mail: validator.escape(email.trim()) },
    });
    if (userEmail === null) {
      const saltRounds = 10;
      let encrypt = await bcrypt.hash(
        validator.escape(password.trim()),
        saltRounds
      );
      let token = jwt.sign(
        { user: validator.escape(email.trim()) },
        process.env.SECRET_TOKEN_REGISTER as string
      );
      let currentDate = new Date();
      let registerTokenObject = {
        token: token,
        limitDate: currentDate.setDate(currentDate.getDate() + 1),
      };
      let UserCreate = await prisma.user.create({
        data: {
          mail: validator.escape(email.trim()),
          firstname: validator.escape(firstname.trim()),
          lastname: validator.escape(lastname.trim()),
          password: encrypt,
          status: false,
          registerToken: registerTokenObject,
          twoFactor: false,
          role: "ROLE_USER",
          discovery: false,
          typeMeeting: { type: "découverte" },
        },
      });

      if (UserCreate === null) {
        return NextResponse.json(
          {
            status: 404,
            message: "Impossible de créer un utilisateur, veuillez réessayer",
          },
          { status: 404 }
        );
      } else {
        let smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.SECRET_SMTP_EMAIL,
            pass: process.env.SECRET_SMTP_PASSWORD,
          },
        });
        let mailOptions = {
          from: process.env.SECRET_SMTP_EMAIL,
          to: process.env.SECRET_SMTP_EMAIL,
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
                              <img src="https://tds-lilac.vercel.app/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
                            </div>
                            <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                              <h1 style="text-align: center">tds coaching</h1>
                              <h2 style="text-align: center">Validation de votre compte</h2>
                              <p style="margin-bottom: 20px">Pour vous connecter à votre compte, veuillez cliquer sur le lien ci-dessous.</p>
                              <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="http://localhost:3000/email-validation/${token}" target="_blank">Vérifier mon compte</a>
                              <p style="margin-top: 20px">Ce lien est valide pendant 48h, au dela de ce temps il ne sera plus disponible et votre compte sera supprimé</p>
                            </div>
                          </div>
                        </body>
                      </html>`,
        };
        smtpTransport.sendMail(mailOptions);
        return NextResponse.json({
          status: 200,
          message: "Un  vous a été envoyer pour activer votre compte",
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
              validator.escape(password.trim()),
              saltRounds
            );
            let token = jwt.sign(
              { user: validator.escape(email.trim()) },
              process.env.SECRET_TOKEN_REGISTER as string
            );
            let currentDate = new Date();
            let registerTokenObject = {
              token: token,
              limitDate: currentDate.setDate(currentDate.getDate() + 1),
            };
            let UserCreate = await prisma.user.create({
              data: {
                mail: validator.escape(email.trim()),
                firstname: validator.escape(firstname.trim()),
                lastname: validator.escape(lastname.trim()),
                password: encrypt,
                status: false,
                registerToken: registerTokenObject,
                twoFactor: false,
                role: "ROLE_USER",
                discovery: false,
                typeMeeting: { type: "découverte" },
              },
            });

            if (UserCreate === null) {
              return NextResponse.json(
                {
                  status: 404,
                  message:
                    "Impossible de créer un utilisateur, veuillez réessayer",
                },
                { status: 404 }
              );
            } else {
              let smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: process.env.SECRET_SMTP_EMAIL,
                  pass: process.env.SECRET_SMTP_PASSWORD,
                },
              });
              let mailOptions = {
                from: process.env.SECRET_SMTP_EMAIL,
                to: process.env.SECRET_SMTP_EMAIL,
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
                                    <img src="https://tds-lilac.vercel.app/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
                                  </div>
                                  <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                    <h1 style="text-align: center">tds coaching</h1>
                                    <h2 style="text-align: center">Validation de votre compte</h2>
                                    <p style="margin-bottom: 20px">Pour vous connecter à votre compte, veuillez cliquer sur le lien ci-dessous.</p>
                                    <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="http://localhost:3000/email-validation/${token}" target="_blank">Vérifier mon compte</a>
                                    <p style="margin-top: 20px">Ce lien est valide pendant 48h, au dela de ce temps il ne sera plus disponible et votre compte sera supprimé</p>
                                  </div>
                                </div>
                              </body>
                            </html>`,
              };
              smtpTransport.sendMail(mailOptions);
              return NextResponse.json({
                status: 200,
                message:
                  "Un email vous a été envoyer pour activer votre compte",
              });
            }
          } else {
            return NextResponse.json(
              {
                status: 404,
                message:
                  "Un utilisateur utilise déjà cet email, veuillez réessayer",
              },
              { status: 404 }
            );
          }
        } else {
          return NextResponse.json(
            {
              status: 404,
              message:
                "Un utilisateur utilise déjà cet email, veuillez réessayer",
            },
            { status: 404 }
          );
        }
      } else {
        return NextResponse.json(
          {
            status: 404,
            message:
              "Un utilisateur utilise déjà cet email, veuillez réessayer",
          },
          { status: 404 }
        );
      }
    }
  }
}
