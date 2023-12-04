import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import nodemailer from "nodemailer";
import { validationBody } from "../../../lib/validation";
import validator from "validator";

//export default withIronSessionApiRoute(
export async function send(req: any, res: NextApiResponse) {
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
    if (pseudo.trim() !== "") {
      return res.status(404).json({
        status: 404,
        message:
          "Une erreur est survenue lors de l'envoie du message, veuillez réessayer plus tard",
      });
    } else {
      /* const user = await prisma.user.findUnique({
        where: { mail: validator.escape(email.trim()), status: true },
      }); */

      let smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.SECRET_SMTP_EMAIL,
          pass: process.env.SECRET_SMTP_PASSWORD,
        },
      });
      /* if (user === null) {
        let mailOptions = {
          from: process.env.SECRET_SMTP_EMAIL,
          to: process.env.SECRET_SMTP_EMAIL,
          subject: object,
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
                                    <h2 style="text-align: center">${firstname} ${lastname} vous a envoyé un message</h2>
                                    <p style="text-align: left; margin-left: 20px">Email : ${email}</p>
                                    <p style="text-align: left; margin-left: 20px">Compte : l'utilisateur est inscrit</p>
                                    <p style="text-align: left; margin-left: 20px">Message : ${message}</p>
                                  </div>
                                </div>
                              </body>
                            </html>`,
        };
        smtpTransport.sendMail(mailOptions);
      } else {
        let mailOptions = {
          from: process.env.SECRET_SMTP_EMAIL,
          to: process.env.SECRET_SMTP_EMAIL,
          subject: object,
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
                                    <h2 style="text-align: center">${firstname} ${lastname} vous a envoyé un message</h2>
                                    <p style="text-align: left; margin-left: 20px">Email : ${email}</p>
                                    <p style="text-align: left; margin-left: 20px">Compte : l'utilisateur n'est pas inscrit</p>
                                    <p style="text-align: left; margin-left: 20px">Message : ${message}</p>
                                  </div>
                                </div>
                              </body>
                            </html>`,
        };
        smtpTransport.sendMail(mailOptions);
      } */
      let mailOptions = {
        from: process.env.SECRET_SMTP_EMAIL,
        to: process.env.SECRET_SMTP_EMAIL,
        subject: object,
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
                                  <h2 style="text-align: center">${firstname} ${lastname} vous a envoyé un message</h2>
                                  <p style="text-align: left; margin-left: 20px">Email : ${email}</p>
                                  <p style="text-align: left; margin-left: 20px">Message : ${message}</p>
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
  } else {
    return res.status(404).json({
      status: 404,
      message: "Une erreur est survenue, veuillez réessayer",
    });
  }
}
/*, {
    password:
      "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
    cookieName: "test",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
); */
