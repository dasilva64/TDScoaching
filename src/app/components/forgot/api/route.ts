import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { validationBody } from "../../../../../lib/validation";
import validator from "validator";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
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
        { status: 404 }
      );
    } else {
      if (user.resetToken) {
        let copyResetToken: any = user.resetToken;
        let limitDate = new Date(copyResetToken.limitDate);
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
          { status: 404 }
        );
      } else {
        let token = jwt.sign(
          { user: user.mail },
          process.env.SECRET_TOKEN_RESET as string
        );
        let currentDate = new Date();
        let resetTokenObject = {
          token: token,
          limitDate: currentDate.setMinutes(currentDate.getMinutes() + 2),
        };
        let editUser = await prisma.user.update({
          where: { mail: validator.escape(email.trim()) },
          data: { resetToken: resetTokenObject },
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
                            <img src="https://tds-lilac.vercel.app/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
                          </div>
                          <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                            <h1 style="text-align: center">tds coaching</h1>
                            <h2 style="text-align: center">Réinitialisation de votre mot de passe</h2>
                            <p style="margin-bottom: 20px">Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous.</p>
                            <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="http://localhost:3000/reinitialisation-mot-de-passe/${token}" target="_blank">Vérifier mon compte</a>
                            <p style="margin-top: 20px">Ce lien est valide pendant 48h, au dela de ce temps il ne sera plus disponible et votre compte sera supprimé</p>
                          </div>
                        </div>
                      </body>
                    </html>`,
        };
        smtpTransport.sendMail(mailOptions);
        return NextResponse.json({
          status: 200,
          message: "Un email vous a été envoyer pour récupérer votre compte",
        });
      }
    }
  }
}
