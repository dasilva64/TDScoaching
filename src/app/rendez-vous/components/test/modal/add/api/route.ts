import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getRateLimiter } from "@/app/lib/rateLimiter";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";

export async function POST(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip; // Récupérer l’IP
  try {
    const rateLimiter = await getRateLimiter(5, 60, "rlflx-meet-add");
    await rateLimiter.consume(ip);
  } catch (err) {
    return NextResponse.json(
      {
        status: 429,
        message: "Trop de requêtes, veuillez réessayer plus tard",
      },
      { status: 429 }
    );
  }
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const csrfToken = headers().get("x-csrf-token");

  if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
    return NextResponse.json(
      { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
      { status: 403 }
    );
  }

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
              status: "pending",
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
          const csrfToken = generateCsrfToken()
          session.csrfToken = csrfToken;
          if (session.rememberMe) {
            session.updateConfig({
              ...sessionOptions,
              cookieOptions: {
                ...sessionOptions.cookieOptions,
                maxAge: 60 * 60 * 24 * 30,
              },
            });
          } else {
            session.updateConfig({
              ...sessionOptions,
              cookieOptions: {
                ...sessionOptions.cookieOptions,
                maxAge: undefined,
              },
            });
          }
          await session.save();
          return NextResponse.json(
            {
              status: 200,
              csrfToken: csrfToken,
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