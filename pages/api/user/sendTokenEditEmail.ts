import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function editPasswordUser(req, res) {
    if (req.session.user) {
      const { mail } = await req.body;
      let user = await prisma.user.findUnique({
        where: { id: req.session.user.id },
      });

      if (user === null) {
        return res.status(404).json({
          status: 404,
          message: "L'utilisateur n'a pas été trouvé, veuillez rézssayer",
        });
      } else {
        if (user.mail === mail) {
          return res.status(404).json({
            status: 404,
            message:
              "Vous ne pouvez pas utiliser la même adresse email, veuillez réessayer",
          });
        }
        let userNew = await prisma.user.findUnique({ where: { mail: mail } });
        if (userNew === null) {
          let min = Math.ceil(10000000);
          let max = Math.floor(99999998);
          let random = Math.floor(Math.random() * (max - min + 1)) + min;
          let current = new Date();
          console.log("etes", user.mail)
          let editUser = await prisma.user.update({
            where: { mail: user.mail },
            data: {
              editEmail: {
                token: random,
                newEmail: mail,
                limitDate: current.setHours(current.getHours() + 1),
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
          smtpTransport.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("succes");
            }
          });
          res.status(200).json({
            status: 200,
            body: user,
            newData: {
              newEmail: mail,
              limitDate: current.setHours(current.getHours() + 1),
            },
            message:
              "Un email vous a été envoyer pour valider votre nouvelle adresse email",
          });
        } else {
          return res.status(404).json({
            status: 404,
            message:
              "Un utilisateur utilise déjà cette adresse mail, veuillez réessayer",
          });
        }
      }
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
