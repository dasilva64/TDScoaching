/* import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import validator, { isDate } from "validator";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { RateLimiter } from "limiter";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";

const limiter = new RateLimiter({
  tokensPerInterval: 600,
  interval: "hour",
  fireImmediately: true,
});

export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn === true) {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(
        {
          status: 400,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    } else {
      const searchParams = request.nextUrl.searchParams;
      const query = searchParams.get('query');
      let smtpTransport = nodemailer.createTransport({
        host: "smtp.ionos.fr",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SECRET_SMTP_EMAIL,
          pass: process.env.SECRET_SMTP_PASSWORD,
        },
      });
      let mailOptions = {
        from: "contact@tds-coachingdevie.fr",
        to: validator.escape(user.mail.trim()),
        subject: "test",
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
                          <h2 style="text-align: center">Annulation de rendez-vous</h2>
                          <p style="margin-bottom: 20px">Un utilisateur a fait une demande de suppression de rendez-vous avant les 24h</p>
                          <p style="margin-bottom: 20px">L'id de l'utilateur est ${query}</p>
                        </div>
                      </div>
                    </body>
                  </html>`,
      };
      await smtpTransport.sendMail(mailOptions);
      return NextResponse.json({
        status: 200,
        message: "Votre demande de suppression a été envoyer",
      });
    }
  } else {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez vous connecter",
      },
      {
        status: 401,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn === true) {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(
        {
          status: 400,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    } else {
      if (user.meetingId === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "Vous n'avez pas de rendez-vous de découverte à supprimer",
          },
          {
            status: 400,
          }
        );
      } else {
        let meeting = await prisma.meeting_test.findUnique({
          where: { id: user.meetingId },
        });
        if (meeting === null) {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Le rendez-vous de découverte n'as pas été trouvé, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          await prisma.meeting.delete({
            where: { id: user.meetingId },
          });
          await prisma.user.update({
            where: { id: session.id },
            data: {
              meetingId: null,
            },
          });
          return NextResponse.json(
            {
              status: 200,
              message: "Le rendez-vous de découverte a bien été supprimé",
            },
            {
              status: 200,
            }
          );
        }
      }
    }
  } else {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez vous connecter",
      },
      {
        status: 401,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn === true) {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(
        {
          status: 400,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    } else {
      const { start, typeCoaching } = (await request.json()) as {
        start: string;
        typeCoaching: string;
      };
      let arrayMessageError = validationBody({
        start: start,
        typeCoaching: typeCoaching,
      });
      if (arrayMessageError.length > 0) {
        return NextResponse.json(
          {
            status: 400,
            type: "validation",
            message: arrayMessageError,
          },
          {
            status: 400,
          }
        );
      }
      if (user.meetingId === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "Vous n'avez pas de rendez-vous de découverte à modifier",
          },
          {
            status: 400,
          }
        );
      } else {
        let date = new Date(start);
        if (date < new Date()) {
          return NextResponse.json(
            {
              status: 400,
              message: "La date ne peut pas être dans le passé",
            },
            {
              status: 400,
            }
          );
        } else {
          let now = new Date(2024, 4, 1, 0, 0, 0, 0);
          for (let i = 0; i < 1000; i++) {
            let copyTypeMeeting: any = user.typeMeeting;
            let newDate = now.setHours(now.getHours() + i);
            let meeting = await prisma.meeting.create({
              data: {
                startAt: new Date(newDate),
                status: true,
                userId: "e732dcba-027f-49d8-bbbf-26762df2d9b4",
                limitDate: null,
                paymentId: null,
                typeMeeting: {
                  ...copyTypeMeeting,
                  coaching: typeCoaching,
                },
              },
            });
          }
          let copyTypeMeeting: any = user.typeMeeting;
          let editMeeting = await prisma.meeting.update({
            where: { id: user.meetingId },
            data: {
              startAt: new Date(start),
              typeMeeting: {
                ...copyTypeMeeting,
                coaching: typeCoaching,
              },
            },
          });
           let meeting = await prisma.meeting.create({
            data: {
              startAt: start,
              status: true,
              userId: user.id,
              limitDate: null,
              paymentId: null,
              typeMeeting: {
                ...copyTypeMeeting,
                coaching: typeCoaching,
              },
            },
          }); 
           await prisma.user.update({
            where: { id: user.id },
            data: {
              meetingId: meeting.id,
              typeMeeting: {
                ...copyTypeMeeting,
                coaching: typeCoaching,
              },
            },
          }); 
          return NextResponse.json(
            {
              status: 200,
              message: "Le rendez-vous a bien été modifié",
            },
            {
              status: 200,
            }
          );
        }
      }
    }
  } else {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez vous connecter",
      },
      {
        status: 401,
      }
    );
  }
}
 */