import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import twilio from "twilio";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function sendTokenEditPhone(req, res) {
    if (req.method === "POST") {
      const { phone, mail, firstname, lastname, password } = await req.body;
      let userEmail = await prisma.user.findUnique({ where: { mail: mail } });
      let userPhone = await prisma.user.findUnique({ where: { phone: phone } });
      if (userEmail === null && userPhone === null) {
        const encrytpPassword = async () => {
          const saltRounds = 10;
          let encrypt = await bcrypt.hash(password, saltRounds);
          let token = jwt.sign(
            { user: mail },
            process.env.SECRET_TOKEN_REGISTER as string
          );
          let currentDate = new Date();
          let registerTokenObject = {
            token: token,
            limitDate: currentDate.setDate(currentDate.getDate() + 1),
          };
          let UserCreate = await prisma.user.create({
            data: {
              mail: mail,
              firstname: firstname,
              lastname: lastname,
              password: encrypt,
              status: false,
              registerToken: registerTokenObject,
              phone: phone,
              twoFactor: false,
              role: "ROLE_USER",
            },
          });

          if (UserCreate === null) {
            return res.status(404).json({
              status: 404,
              message: "Impossible de créer un utilisateur veuillez réessayer",
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
              subject: "Validation of your account",
              html: `<div><h1>tds coaching</h1><p>Click on the link for validate your account</p><p>This link is available one day</p><a href='http://localhost:3000/email-validation/${token}'>Click here</a></div>`,
            };
            smtpTransport.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("succes");
              }
            });
            return res.status(200).json({
              status: 200,
              message: "Un email vous a été envoyer pour activer votre compte",
            });
          }
        };
        encrytpPassword();
      } else {
        if (userEmail !== null) {
          return res.status(404).json({
            status: 404,
            message:
              "Un utilisateur utilise déjà cet email, veuillez réessayer",
          });
        } else {
          return res.status(404).json({
            status: 404,
            message:
              "Un utilisateur utilise déjà ce numéro de téléphone, veuillez réessayer",
          });
        }
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
