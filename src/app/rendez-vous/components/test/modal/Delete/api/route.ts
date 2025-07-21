import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
      points: 5,
      duration: 60,
      keyPrefix: "rlflx-meet-delete"
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
        if (user.meetingId === null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous n'avez pas de rendez-vous à supprimer",
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
                  "Le rendez-vous n'as pas été trouvé, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            try {
              await prisma.$transaction(async (tx) => {
                await prisma.user.update({
                  where: { id: session.id },
                  data: {
                    meetingId: null,
                  },
                });
                await prisma.meeting_test.update({
                  where: { id: user.meetingId! },
                  data: {
                    status: "cancelled"
                  }
                });
                await prisma.offre_test.update({
                  where: { id: user.offreId! },
                  data: {
                    currentNumberOfMeeting: null,
                     status: "cancelled"
                  }
                })
              })
              return NextResponse.json(
                {
                  status: 200,
                  message: "Le rendez-vous a bien été supprimé",
                },
                {
                  status: 200,
                }
              );
            } catch {
              return NextResponse.json(
                {
                  status: 400,
                  message:
                    "Une erreur est survenue lors de la suppression du rendez-vous, veuillez réessayer",
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
    handleError(error)
  }

}