import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "../../../../../../lib/session";
import { validationBody } from "../../../../../../lib/validation";
import validator from "validator";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import prisma from "../../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as {
    email: string;
  };
  let arrayMessageError = validationBody({ email: email });
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
  let userEmail = await prisma.user.findUnique({
    where: { mail: validator.escape(email.trim()) },
  });
  if (userEmail === null) {
    return NextResponse.json(
      {
        status: 404,
        message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
      },
      { status: 404 }
    );
  } else {
    let token = jwt.sign(
      { user: validator.escape(email.trim()) },
      process.env.SECRET_TOKEN_REGISTER as string
    );
    let currentDate = new Date();
    let registerTokenObject = {
      token: token,
      limitDate: currentDate.setDate(currentDate.getDate() + 1),
    };
    let editRegisterToken = await prisma.user.update({
      where: { mail: validator.escape(email.trim()) },
      data: {
        registerToken: registerTokenObject,
      },
    });
    if (editRegisterToken === null) {
      return NextResponse.json(
        {
          status: 400,
          type: "error",
          message:
            "Une erreur est survenue lors de la modification de l'utilisateur, veuillez réessayer",
        },
        { status: 400 }
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
        subject: "Validation of your account",
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
                                  <p style="margin-bottom: 20px">Pour valider votre compte, veuillez cliquer sur le lien ci-dessous.</p>
                                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="http://localhost:3000/email-validation/${token}" target="_blank">Vérifier mon compte</a>
                                  <p style="margin-top: 20px">Ce lien est valide pendant 48h, au dela de ce temps il ne sera plus disponible</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
      };
      smtpTransport.sendMail(mailOptions);
      return NextResponse.json({
        status: 200,
        message: "Un email vous a été renvoyer pour activer votre compte",
      });
    }
  }

  // simulate looking up the user in db
  //await sleep(250);
}

//http://localhost:3000/email-validation/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoib0BvLmNvbSIsImlhdCI6MTcwNTY2OTc5M30.Ycw9rBpIrmbnsRHZ3lC3FOw9HifHqG1zHrCqEK6lsjs
//http://localhost:3000/email-validation/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoib0BvLmNvbSIsImlhdCI6MTcwNTY2OTIyNH0.n1ofI7bZxOqagqyhMxAM5OsMBreG65zHWdCOFjlyvp0