import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { sessionOptions } from "../../../lib/session";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function registerRoute(req: any, res: NextApiResponse) {
  if (req.method === "POST") {
    const { mail, password, firstname, lastname, phone } = await req.body;

    let user = await prisma.user.findUnique({ where: { mail: mail } });

    if (user === null) {
      const encrytpPassword = async () => {
        const saltRounds = 10;
        let encrypt = await bcrypt.hash(password, saltRounds);
        let token = jwt.sign(
          { user: req.body.email },
          process.env.SECRET_TOKEN_REGISTER as string
        );
        let UserCreate = await prisma.user.create({
          data: {
            mail: mail,
            password: encrypt,
            firstname: firstname,
            lastname: lastname,
            status: false,
            token: token,
            phone: phone,
            twoFactor: false,
            role: "ROLE_USER",
          },
        });
        if (UserCreate === null) {
          return res.status(404).json({
            status: 404,
            message: "Impossible de créer un utilisateur veuillez réessayer",
          });
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
            html: `<div><h1>tds coaching</h1><p>Click on the link for validate your account</p><p>This link is available one day</p><a href='http://localhost:3000/email-validation/${token}'>Click here</a></div>`,
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
            message: "Un email vous a été envoyer pour activer votre compte",
          });
        }
      };
      encrytpPassword();
    } else {
      return res.status(404).json({
        status: 404,
        message: "Un utilisateur utilise déjà cet email, veuillez réessayer",
      });
    }
  } else {
    res.status(404).json({
      status: 404,
      body: { message: "Not found" },
    });
  }
}
