import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
      points: 5,
      duration: 60,
      keyPrefix: "rlflx-meet-add"
    });
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
    if (session.isLoggedIn === true) {
      let user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        return NextResponse.json(
          {
            status: 401,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          },
          {
            status: 401,
          }
        );
      } else {
        const { start, typeCoaching, pseudo } = (await request.json()) as {
          start: string;
          typeCoaching: string;
          pseudo: string;
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
        if (pseudo.trim() !== "") {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message: "Vous ne pouvez pas créer un rendez-vous, veuillez réessayer",
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
            try {
              await prisma.$transaction(async (tx) => {
                let meeting = await prisma.meeting_test.create({
                  data: {
                    startAt: start,
                    status: "pending",
                    userMail: user?.mail!,
                    offreId: user?.offreId,
                    numberOfMeeting: "1"
                  },
                });
                let EditOffer = await prisma.offre_test.update({
                  where: { id: user?.offreId! },
                  data: {
                    currentNumberOfMeeting: 1,
                    currentMeetingId: meeting.id,
                    coaching: typeCoaching,
                  }
                })
                let EditUser = await prisma.user.update({
                  where: { id: user?.id },
                  data: {
                    meetingId: meeting.id,
                  },
                });
                return { meeting, EditOffer, EditUser };
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
            } catch {
              return NextResponse.json(
                {
                  status: 400,
                  message: "Un problème est survenue lors de la creation du rendez-vous, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
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
  } catch (error: any) {
    return handleError(error)
  }
}