import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import validator from "validator";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function deleteAccount(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { token } = await req.body;
        if (token && validator.escape(token.trim()).length > 0) {
          const { verify } = jwt;
          const decodeToken: any = verify(
            validator.escape(token.trim()),
            process.env.SECRET_TOKEN_DELETE as string
          );
          let user = await prisma.user.findUnique({
            where: { mail: decodeToken.user },
          });
          if (user === null) {
            return res.status(404).json({
              status: 404,
              message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
            });
          } else {
            if (user.deleteToken && user.status === true) {
              let copyDeleteToken: any = user?.deleteToken;
              if (validator.escape(token.trim()) === copyDeleteToken.token) {
                if (new Date().getTime() > copyDeleteToken.limitDate) {
                  const deleteToken = await prisma.user.update({
                    where: { id: user.id },
                    data: { deleteToken: Prisma.JsonNull },
                  });
                  return res.status(404).json({
                    status: 404,
                    message:
                      "Le lien de suppression de votre compte est plus valide, veuillez réessayer",
                  });
                } else {
                  if (user.meetingId !== null) {
                    return res.status(404).json({
                      status: 404,
                      message:
                        "Vous ne pouvez pas supprimer votre compte car vous avez un rendez-vous de prévu",
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
                                            <img src="https://testtds2.vercel.app/_next/image?url=%2Fassets%2Ficone%2Ftrash.png&w=750&q=75" width="80px" height="80px" />
                                          </div>
                                          <h2 style="text-align: center">Suppression d'un compte</h2>
                                          <ul style="list-style: none; padding: 0px">
                                            <li style="margin: 0px 0px 10px 0px">Prénom : ${user.firstname}</li>
                                            <li style="margin: 0px 0px 10px 0px">Nom de famille : ${user.lastname}</li>
                                            <li style="margin: 0px 0px 10px 0px">Email : ${user.mail}</li>
                                            <li style="margin: 0px 0px 10px 0px">Raison : ${user.deleteReason}</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </body>
                                  </html>`,
                    };
                    smtpTransport.sendMail(mailOptions);
                    const deleteUser = await prisma.user.delete({
                      where: { id: user.id },
                    });
                    req.session.destroy();
                    return res.status(200).json({
                      status: 200,
                      message: "Votre compte a bien été supprimé",
                    });
                  }
                }
              } else {
                return res.status(404).json({
                  status: 404,
                  message: "Le token n'est pas valide, veuillez réessayer",
                  body: user,
                });
              }
            } else {
              res.status(404).json({
                status: 404,
                message:
                  "Le lien de suppression de votre compte est plus valide, veuillez réessayer",
              });
            }
          }
        } else {
          return res.status(404).json({
            status: 404,
            message: "Le token n'éxiste pas, veuillez réessayer",
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
