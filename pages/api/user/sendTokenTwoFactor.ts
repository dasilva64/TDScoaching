import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import twilio from "twilio";
import nodemailer from "nodemailer"

export default withIronSessionApiRoute(
  async function sendTokenTwoFactor(req, res) {
    if (req.method === "GET") {
      if (req.session.user) {
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          let min = Math.ceil(10000000);
          let max = Math.floor(99999998);
          let random = Math.floor(Math.random() * (max - min + 1)) + min;
          let current = new Date();
          let editUser = await prisma.user.update({
            where: {
              id: req.session.user.id,
            },
            data: {
              twoFactorCode: {
                token: random,
                limitDate: current.setMinutes(current.getMinutes() + 5),
              },
            },
          });
          let copyTwoFactorCode: any = editUser.twoFactorCode;
          let userObject = {
            id: editUser.id,
            firstname: editUser.firstname,
            lastname: editUser.lastname,
            email: editUser.mail,
            twoFactorCode: { limitDate: copyTwoFactorCode.limitDate },
          };
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
                          <img src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
                        </div>
                        <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                          <h1 style="text-align: center">tds coaching</h1>
                          <h2 style="text-align: center">Activation de la double authentification</h2>
                          <p style="margin-bottom: 20px">Pour activer la double authentification sur votre compte, veuillez entrer le code ci-dessous.</p>
                          <p style="width: 100px; margin: auto; padding: 20px; background: white; border-radius: 10px">${random}</p>
                          <p style="margin-top: 20px">Ce code est valide pendant 48h, au dela de ce temps il ne sera plus disponible</p>
                        </div>
                      </div>
                    </body>
                  </html>`,
          };
          smtpTransport.sendMail(mailOptions);
          res.status(200).json({
            status: 200,
            message: "Un code de vérification vous a été envoyé par email",
            body: userObject,
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        });
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
