import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { validationBody } from "../../../../../lib/validation";
import validator from "validator";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export async function POST(NextRequest) {
  /* let smtpTransport = nodemailer.createTransport({
    service: "smtp.ionos.fr",
    port: 587,
    secure: true,
    auth: {
      user: process.env.SECRET_SMTP_EMAIL,
      pass: process.env.SECRET_SMTP_PASSWORD,
    },
  }); */
  /* let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SECRET_SMTP_EMAIL_TEST,
      pass: process.env.SECRET_SMTP_PASSWORD_TEST,
    },
  }); */
  /* smtpTransport.verify(function (error, success) {
    if (error) {
      console.log("error", error);
    } else {
      console.log("Server is ready to take our messages");
    }
  }); */
  /* let mailOptions = {
    from: "thomasdasilva010@gmail.com",
    to: "thomasdasilva010@gmail.com",
    subject: "object",
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
                              <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                            </div>
                            <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                              <h1 style="text-align: center">tds coaching</h1>
                            </div>
                          </div>
                        </body>
                      </html>`,
  };
  smtpTransport.sendMail(mailOptions); */
  const { email, firstname, lastname, object, message, pseudo } =
    (await NextRequest.json()) 
    
  let arrayMessageError = validationBody({
    email: email,
    firstname: firstname,
    lastname: lastname,
    object: object,
    message: message,
  });
  if (arrayMessageError.length > 0) {
    return NextResponse.json(
      {
        status: 400,
        type: "validation",
        message: arrayMessageError,
      },
      { status: 400 }
    );
  }
  if (pseudo.trim() !== "") {
    return NextResponse.json(
      {
        status: 400,
        type: "error",
        message:
          "Une erreur est survenue lors de l'envoie du message, veuillez réessayer plus tard",
      },
      { status: 400 }
    );
  } else {
    const user = await prisma.user.findUnique({
      where: { mail: validator.escape(email.trim()), status: true },
    });
    /*  const oAuth2 = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oAuth2.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    }); */
    const createTransporter = async () => {
      const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
      });

      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            reject("Failed to create access token :(");
          }
          resolve(token);
        });
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          accessToken,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      return transporter;
    };
    const sendEmail = async (emailOptions) => {
      let emailTransporter = await createTransporter();
      await emailTransporter.sendMail(emailOptions);
    };
    /* let smtpTransport = nodemailer.createTransport({
      host: "smtp.ionos.com",
      port: 465,
      auth: {
        user: process.env.SECRET_SMTP_EMAIL,
        pass: process.env.SECRET_SMTP_PASSWORD,
      },
    });*/
    if (user === null) {
      await sendEmail({
        from: "thomasdasilva010@gmail.com",
        to: "thomasdasilva010@gmail.com",
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
                                  <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                </div>
                                <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                  <h1 style="text-align: center">tds coaching</h1>
                                  <h2 style="text-align: center">${validator.escape(
                                    firstname.trim()
                                  )} ${validator.escape(
          lastname.trim()
        )} vous a envoyé un message</h2>
                                  <p style="text-align: left; margin-left: 20px">Email : ${validator.escape(
                                    email.trim()
                                  )}</p>
                                  <p style="text-align: left; margin-left: 20px">Compte : l'utilisateur n'est pas inscrit</p>
                                  <p style="text-align: left; margin-left: 20px">Message : ${validator.escape(
                                    message.trim()
                                  )}</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
      });
      //transporter.sendMail(mailOptions);
    } else {
      await sendEmail({
        from: "thomasdasilva010@gmail.com",
        to: "thomasdasilva010@gmail.com",
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
                                  <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                </div>
                                <div style="text-align: center; background: aqua; padding: 50px 0px; border-radius: 20px">
                                  <h1 style="text-align: center">tds coaching</h1>
                                  <h2 style="text-align: center">${validator.escape(
                                    firstname.trim()
                                  )} ${validator.escape(
          lastname.trim()
        )} vous a envoyé un message</h2>
                                  <p style="text-align: left; margin-left: 20px">Email : ${validator.escape(
                                    email.trim()
                                  )}</p>
                                  <p style="text-align: left; margin-left: 20px">Compte : l'utilisateur est inscrit</p>
                                  <p style="text-align: left; margin-left: 20px">Message : ${validator.escape(
                                    message.trim()
                                  )}</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
      });
      //transporter.sendMail(mailOptions);
    }

    return NextResponse.json({
      status: 200,
      body: user,
      message:
        "Merci de nous avoir contacter nous allons vous répondre le plus vite possible",
    });
  }
}