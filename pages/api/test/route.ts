import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export function GET(request: NextRequest) {
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
  return NextResponse.json(
    { message: "Hello world!" },
    {
      status: 200,
    }
  );
}
