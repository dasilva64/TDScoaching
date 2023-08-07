import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function send(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      const { email, firstname, lastname, object, message } = await req.body;

      const user = await prisma.user.findUnique({ where: { mail: email } });

      let smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.SECRET_SMTP_EMAIL,
          pass: process.env.SECRET_SMTP_PASSWORD,
        },
      });
      if (user === null) {
        let mailOptions = {
          from: process.env.SECRET_SMTP_EMAIL,
          to: process.env.SECRET_SMTP_EMAIL,
          subject: object,
          html: `<div><h1>${firstname} ${lastname}</h1><p>${message}</p><p>pas de compte</p></div>`,
        };
        smtpTransport.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("succes");
          }
        });
      } else {
        let mailOptions = {
          from: process.env.SECRET_SMTP_EMAIL,
          to: process.env.SECRET_SMTP_EMAIL,
          subject: object,
          html: `<div><h1>${firstname} ${lastname}</h1><p>${message}</p><p>compte</p></div>`,
        };
        smtpTransport.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("succes");
          }
        });
      }

      return res.status(200).json({
        status: 200,
        message:
          "Merci de nous avoir contacter nous allons vous répondre le plus vite possible",
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
