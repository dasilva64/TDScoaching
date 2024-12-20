/* import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
  sessionOptionsRemeber,
} from "../../../../lib/session";
import { validationBody } from "../../../../lib/validation";
import validator from "validator";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import prisma from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { email, password, pseudo, remember, code } =
    (await request.json()) as {
      email: string;
      password: string;
      pseudo: string;
      remember: boolean;
      code: string;
    };
  let arrayMessageError = validationBody({ email: email, password: password });
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
        message: "Vous ne pouvez pas vous connecter, veuillez réessayer",
      },
      { status: 400 }
    );
  } else {
    const user = await prisma.user.findUnique({
      where: {
        mail: validator.escape(email),
      },
    });
    if (user) {
      const decode = await bcrypt.compare(
        validator.escape(password),
        user.password
      );
      if (decode === false) {
        return NextResponse.json(
          {
            status: 404,
            message:
              "Mauvaise combinaison email/mot de passe, veuillez réessayer",
          },
          { status: 404 }
        );
      } else {
        if (user.twoFactor === true) {
          let min = Math.ceil(10000000);
          let max = Math.floor(99999998);
          let random = Math.floor(Math.random() * (max - min + 1)) + min;
          let current = new Date();
          let editUser = await prisma.user.update({
            where: {
              mail: validator.escape(email),
            },
            data: {
              twoFactorCode: {
                token: random,
                limitDate: current.setMinutes(current.getMinutes() + 5),
              },
            },
          });
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
            subject: "Double authentification",
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
                                <h2 style="text-align: center">Connexion avec la double authentification</h2>
                                <p style="margin-bottom: 20px">Pour vous connecter avec la double authentification sur votre compte, veuillez entrer le code ci-dessous.</p>
                                <p style="width: 100px; margin: auto; padding: 20px; background: white; border-radius: 10px">${random}</p>
                                <p style="margin-top: 20px">Ce code est valide pendant 48h, au dela de ce temps il ne sera plus disponible</p>
                              </div>
                            </div>
                          </body>
                        </html>`,
          };
          smtpTransport.sendMail(mailOptions);
          return NextResponse.json({
            status: 200,
            message: `Un code vous a été envoyé sur votre addresse email`,
          });
        } else {
          return NextResponse.json(
            {
              status: 404,
              message: `Vous n'avez pas la double authentification acitivé, veuillez réessayer`,
            },
            { status: 404 }
          );
        }
      }
    } else {
      return NextResponse.json(
        {
          status: 404,
          message:
            "Mauvaise combinaison email/mot de passe, veuillez réessayer",
        },
        { status: 404 }
      );
    }
  }
}
 */