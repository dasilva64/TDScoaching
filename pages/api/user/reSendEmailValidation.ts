import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import twilio from "twilio";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import { validationBody } from "../../../lib/validation";
import validator from "validator";

export default withIronSessionApiRoute(
  async function sendTokenEditPhone(req, res) {
    if (req.method === "POST") {
      const { email } = await req.body;
      let arrayMessageError = validationBody(req.body);
      if (arrayMessageError.length > 0) {
        return res.status(400).json({
          status: 400,
          message: arrayMessageError,
        });
      }
      let userEmail = await prisma.user.findUnique({
        where: { mail: validator.escape(email.trim()) },
      });
      if (userEmail === null) {
        return res.status(404).json({
          status: 404,
          message: "Aucun utilisateur n'utilise cet email, veuillez réessayer",
        });
      } else {
        let token = jwt.sign(
          { user: validator.escape(email.trim()) },
          process.env.SECRET_TOKEN_REGISTER as string
        );
        let currentDate = new Date();
        let registerTokenObject = {
          token: token,
          limitDate: currentDate.setDate(currentDate.getDate() + 1),
        };
        let editRegisterToken = await prisma.user.update({
          where: { mail: validator.escape(email.trim()) },
          data: {
            registerToken: registerTokenObject,
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
          html: `<div><h1>tds coaching</h1><p>Click on the link for validate your account</p><p>This link is available one day</p><a href='http://localhost:3000/email-validation/${token}'>Click here</a></div>`,
        };
        smtpTransport.sendMail(mailOptions);
        return res.status(200).json({
          status: 200,
          message: "Un email vous a été renvoyer pour activer votre compte",
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
