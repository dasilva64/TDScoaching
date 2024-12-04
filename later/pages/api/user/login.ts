/* import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import { validationBody } from "../../../lib/validation";
import validator from "validator";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function login(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      const { email, password, pseudo } = await req.body;
      let arrayMessageError = validationBody(req.body);
      if (arrayMessageError.length > 0) {
        return res.status(400).json({
          status: 400,
          type: "validation",
          message: arrayMessageError,
        });
      }
      if (pseudo.trim() !== "") {
        return res.status(400).json({
          status: 400,
          type: "error",
          message: "Vous ne pouvez pas vous connecter, veuillez réessayer",
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
            return res.status(400).json({
              status: 400,
              type: "error",
              message:
                "Mauvaise combinaison email/mot de passe, veuillez réessayer",
            });
          } else {
            if (user.status === false && user.registerToken) {
              let copyRegisterToken: any = user?.registerToken;
              if (new Date().getTime() > copyRegisterToken.limitDate) {
                const deleteUser = await prisma.user.delete({
                  where: { mail: user.mail },
                });
                return res.status(400).json({
                  status: 400,
                  type: "error",
                  message:
                    "Votre compte a été supprimé car vous ne l'avez pas validé à temps, veuillez vous réinscrire",
                });
              }
              return res.status(400).json({
                status: 400,
                type: "error",
                message:
                  "Votre compte n'est pas encore validé, veuillez vérifier votre boite mail",
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
                      limitDate: current.setMinutes(current.getMinutes() + 1),
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
                  body: null,
                  message: `Un code vous a été envoyé sur votre addresse email`,
                });
              } else {
                let userObject = {
                  role: user.role,
                  id: user.id,
                };
                req.session.user = userObject;
                await req.session.save();
                return res.status(200).json({
                  status: 200,
                  body: userObject,
                  message: `Bonjour, ${user.firstname} vous êtes maintenant connecté`,
                });
              }
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
      return res.status(405).json({
        status: 405,
        message:
          "La méthode de la requête n'est pas autorisé, veuillez réessayer",
      });
    }
  },
  async (req, res) => {
    const { remember } = await req.body;
    return {
      password:
        "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
      cookieName: "test",
      cookieOptions: {
        maxAge: remember ? 60 * 60 * 24 * 30 : undefined,
        secure: process.env.NODE_ENV === "production",
      },
    };
  }
); */
