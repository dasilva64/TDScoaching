import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export default withIronSessionApiRoute(
  async function deleteAccount(req, res) {
    if (req.method === "POST") {
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
              html: `<div><h1>tds coaching</h1><p>Click on the link for validate your account</p><p>This link is available one day</p><a href='http://localhost:3000/suppression-compte/${token}'>Click here</a></div>`,
            };
            smtpTransport.sendMail(mailOptions);
            res.status(200).json({
              status: 200,
              message:
                "Un email vous a été envoyer pour supprimer votre compte",
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
