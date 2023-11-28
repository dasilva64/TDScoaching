import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import nodemailer from "nodemailer";
import { validationBody } from "../../../lib/validation";
import validator from "validator";
import bcrypt from "bcrypt";

export default withIronSessionApiRoute(
  async function sendTokenTwoFactor(req, res) {
    if (req.method === "POST") {
      const { email, password, pseudo } = await req.body;

      let arrayMessageError = validationBody(req.body);
      if (arrayMessageError.length > 0) {
        return res.status(400).json({
          status: 400,
          message: arrayMessageError,
        });
      }
      if (pseudo.trim() !== "") {
        return res.status(404).json({
          status: 404,
          message:
            "Une erreur est survenue lors de la connection, veuillez réessayer plus tard",
        });
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
            return res.status(404).json({
              status: 404,
              message:
                "Mauvaise combinaison email/mot de passe, veuillez réessayer",
            });
          } else {
            if (user.twoFactor === true) {
              let min = Math.ceil(10000000);
              let max = Math.floor(99999998);
              let random = Math.floor(Math.random() * (max - min + 1)) + min;
              let current = new Date();
              let editUser = await prisma.user.update({
                where: {
                  mail: email,
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
                                  <img src="https://tds-lilac.vercel.app/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
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
              return res.status(200).json({
                status: 200,
                message: `Un code vous a été envoyé sur votre addresse email`,
              });
            } else {
              return res.status(404).json({
                status: 404,
                message: `Vous n'avez pas la double authentification acitivé, veuillez réessayer`,
              });
            }
          }
        } else {
          return res.status(404).json({
            status: 404,
            message:
              "Mauvaise combinaison email/mot de passe, veuillez réessayer",
          });
        }
      }
    } else {
      return res.status(404).json({
        status: 404,
        message: "Une erreur est survenue, veuillez réessayer",
      });
    }
  },
  {
    password:
      "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
    cookieName: "test",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
