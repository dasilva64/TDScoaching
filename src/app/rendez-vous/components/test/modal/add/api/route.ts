import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import validator, { isDate } from "validator";
import bcrypt from "bcrypt";
import { RateLimiter } from "limiter";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";

const limiter = new RateLimiter({
  tokensPerInterval: 600,
  interval: "hour",
  fireImmediately: true,
});

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
      if (user.meetingId !== null) {
        return NextResponse.json(
          {
            status: 400,
            message: "Vous avez déjà un rendez-vous de pris",
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
          /* let now = new Date(2024, 4, 1, 0, 0, 0, 0);
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
          } */
          //let copyTypeMeeting: any = user.typeMeeting;
          let meeting = await prisma.meeting_test.create({
            data: {
              startAt: start,
              status: validator.escape("pending"),
              userMail: user.mail,
              confirm: false,
              coaching: typeCoaching,
              type: "discovery"
              /* typeMeeting: {
                ...copyTypeMeeting,
                coaching: typeCoaching,
              }, */
            },
          });
          await prisma.user.update({
            where: { id: user.id },
            data: {
              meetingId: meeting.id,
              /* typeMeeting: {
                ...copyTypeMeeting,
                coaching: typeCoaching,
              }, */
            },
          });
          return NextResponse.json(
            {
              status: 200,
              message: "Le rendez-vous a bien été pris",
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