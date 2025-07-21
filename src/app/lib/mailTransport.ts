import nodemailer from "nodemailer";

export const smtpTransport = nodemailer.createTransport({
  host: "smtp.ionos.fr",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SECRET_SMTP_EMAIL,
    pass: process.env.SECRET_SMTP_PASSWORD,
  },
});