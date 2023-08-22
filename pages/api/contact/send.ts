import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import nodemailer from "nodemailer";
import { validationBody } from "../../../lib/validation";
import validator from "validator";

export default withIronSessionApiRoute(
  async function send(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      const { email, firstname, lastname, object, message, pseudo } =
        await req.body;
      let arrayMessageError = validationBody(req.body);
      if (arrayMessageError.length > 0) {
        return res.status(400).json({
          status: 400,
          message: arrayMessageError,
        });
      }
      if (pseudo !== "") {
        return res.status(404).json({
          status: 404,
          message:
            "Une erreur est survenue lors de l'envoie du message, veuillez réessayer plus tard",
        });
      } else {
        const user = await prisma.user.findUnique({
          where: { mail: validator.escape(email) },
        });

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
            html: `<div><h1>${validator.escape(firstname)} ${validator.escape(
              lastname
            )}</h1><p>${validator.escape(
              message
            )}</p><p>pas de compte</p></div>`,
          };
          smtpTransport.sendMail(mailOptions);
        } else {
          let mailOptions = {
            from: process.env.SECRET_SMTP_EMAIL,
            to: process.env.SECRET_SMTP_EMAIL,
            subject: object,
            html: `<div><h1>${validator.escape(firstname)} ${validator.escape(
              lastname
            )}</h1><p>${validator.escape(message)}</p><p>compte</p></div>`,
          };
          smtpTransport.sendMail(mailOptions);
        }
        return res.status(200).json({
          status: 200,
          message:
            "Merci de nous avoir contacter nous allons vous répondre le plus vite possible",
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
