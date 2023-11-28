import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function emailReSendCode(req, res) {
    if (req.method === "GET") {
      if (req.session.user) {
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
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
            let userObject = {
              id: editUser.id,
              role: editUser.role,
              firstname: editUser.firstname,
              lastname: editUser.lastname,
              email: editUser.mail,
              editEmail: {
                newEmail: copyEditEmail.newEmail,
              },
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
                      <img src="https://tds-lilac.vercel.app/_next/image?url=%2Fassets%2Flogo%2Flogo.png&w=750&q=75" width="80px" height="80px" />
                    </div>
                    <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                      <h1 style="text-align: center">tds coaching</h1>
                      <h2 style="text-align: center">Validation de votre nouvelle addresse email</h2>
                      <p style="margin-bottom: 20px">Pour activé votre nouvelle addresse email, veuillez entrer le code ci-dessous.</p>
                      <p style="width: 100px; margin: auto; padding: 20px; background: white; border-radius: 10px">${random}</p>
                      <p style="margin-top: 20px">Ce code est valide pendant 48h, au dela de ce temps il ne sera plus disponible</p>
                    </div>
                  </div>
                </body>
              </html>`,
            };
            smtpTransport.sendMail(mailOptions);
            return res.json({
              status: 200,
              body: userObject,
              message:
                "Un code vous à été renvoyer pour valider votre adresse email",
            });
          } else {
            return res.json({
              status: 400,
              message:
                "Aucune modification d'email en cours, veuillez réessayer",
            });
          }
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
