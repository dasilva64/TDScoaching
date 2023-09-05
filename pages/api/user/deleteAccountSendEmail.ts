import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export default withIronSessionApiRoute(
  async function deleteAccount(req, res) {
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
      subject: "Suppression de compte",
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
                            <div style="text-align: center">
                              <img src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Fcalendarcheck.png&w=750&q=75" width="80px" height="80px" />
                            </div>
                            <h2 style="text-align: center">Suppression de votre compte</h2>
                            <p style="margin: 0px 40px 40px">Vous avez fait une demande de suppression de compte. En supprimant votre compte vous n'aurai plus accès au rendez-vous passée. Toutes les données qui sont enregistré vous concernant seront supprimé (email, prénom, nom de famille)</p>
                            <p>Attention vous ne pourrez plus revenir en arrière après cette action.</p>
                            <p style="margin: 0px 0px 40px 0px">Pour supprimer votre compte veuillez cliquer sur le bouton ci-dessous.</p>
                            <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white; margin-top: 50px" href="http://localhost:3000/suppression-compte/${"token"}" target="_blank">Supprimer votre compte</a>
                          </div>
                        </div>
                      </body>
                    </html>`,
    };
    smtpTransport.sendMail(mailOptions);
    return res.status(200).json({
      status: 200,
      message: "Un email vous a été envoyer pour supprimer votre compte",
    });
    /* if (req.method === "POST") {
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
          if (user.meetingId === null) {
            let token = jwt.sign(
              { user: user.mail },
              process.env.SECRET_TOKEN_DELETE as string
            );
            let limitDate = new Date();
            limitDate.setMinutes(limitDate.getMinutes() + 1);

            let editUser = await prisma.user.update({
              where: { id: req.session.user.id },
              data: {
                deleteToken: {
                  token: token,
                  limitDate: limitDate.getTime(),
                },
              },
            });
          } else {
            return res.status(404).json({
              status: 404,
              message:
                "Vous ne pouvez pas supprimer votre compte car vous avez un rendez-vous de prévu",
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
    } */
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
