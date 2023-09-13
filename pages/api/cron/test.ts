import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import nodemailer from "nodemailer";
import { validationBody } from "../../../lib/validation";
import validator from "validator";

export default function send(req: any, res: NextApiResponse) {
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
    subject: "cron",
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
                              </div>
                            </div>
                          </body>
                        </html>`,
  };
  smtpTransport.sendMail(mailOptions);
  return res.status(200).json({
    status: 200,
    message:
      "Merci de nous avoir contacter nous allons vous répondre le plus vite possible",
  });
}
