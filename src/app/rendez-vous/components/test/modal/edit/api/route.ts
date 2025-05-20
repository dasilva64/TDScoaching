import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
      if (user.meetingId === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "Vous n'avez pas de rendez-vous à modifier",
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
            let editMeeting = await prisma.meeting_test.update({
              where: { id: user.meetingId },
              data: {
                coaching: typeCoaching,
                startAt: start,
              },
            });
            if (editMeeting === null) {
                return NextResponse.json(
                    {
                      status: 400,
                      message: "Une erreur est survenue lors de la modification du rendez-vous, veuillez réessayer",
                    },
                    {
                      status: 400,
                    }
                  );
            } else {
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
