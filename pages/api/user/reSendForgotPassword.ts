import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function forgotPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { email } = await req.body;
    const user = await prisma.user.findUnique({ where: { mail: email } });
    if (user === null) {
      return res.status(404).json({
        status: 404,
        message:
          "Aucun compte n'est associé à cette adresse email, veuillez réessayer",
      });
    } else {
      if (user.resetToken) {
        let token = jsonwebtoken.sign(
          { user: user.mail },
          process.env.SECRET_TOKEN_RESET as string
        );
        let currentDate = new Date();
        let resetTokenObject = {
          token: token,
          limitDate: currentDate.setMinutes(currentDate.getMinutes() + 30),
        };
        let editUser = await prisma.user.update({
          where: { mail: email },
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
          html: `<div><h1>tds coaching</h1><p>Cliquer sur le lien pour réinitialiser votre mot de passe</p><p>Ce lien n'est disponible pendant 1 jour</p><a href='http://localhost:3000/reinitialisation-mot-de-passe/${token}'>Cliquer ici</a></div>`,
        };
        smtpTransport.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("succes");
          }
        });
        res.status(200).json({
          status: 200,
          message: "Un email vous a été envoyer pour récupérer votre compte",
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Aucun",
        });
      }
    }
  } else {
    return res.status(404).json({
      status: 404,
      message: "Une erreur est survenue, veuillez réessayer",
    });
  }
}
