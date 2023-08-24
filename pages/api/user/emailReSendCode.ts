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
              html: `<div><h1>tds coaching</h1><p>Cliquer sur le lien pour valider votre adresse email</p><p>Ce lien est valable 1 jours</p><p>Votre code de vérification est ${random}</p></div>`,
            };
            smtpTransport.sendMail(mailOptions);
            return res.json({
              status: 200,
              body: editUser,
              message:
                "Un code vous à été renvoyer pour valider votre numéro de téléphone",
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
