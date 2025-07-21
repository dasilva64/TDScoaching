import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimit } from "@/app/lib/rateLimiter";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
      points: 1000,
      duration: 60,
      keyPrefix: "rlflx-rdv-get"
    });
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (session.isLoggedIn === true) {
      const user = await prisma.user.findUnique({
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
        let link = null;
        try {
          const { allMeeting, meeting, offre, allOffresWithMeetings } = await prisma.$transaction(async (tx) => {
            const allMeeting = await tx.meeting_test.findMany({
              where: {
                startAt: { gte: new Date() },
                status: { not: "cancelled" },
              },
              select: {
                startAt: true,
                userMail: true,
              },
            });

            const meeting = user.meetingId
              ? await tx.meeting_test.findUnique({ where: { id: user.meetingId } })
              : null;

            const offre = user.offreId
              ? await tx.offre_test.findUnique({ where: { id: user.offreId } })
              : null;

            const allOffresWithMeetings = user.offreId
              ? await tx.offre_test.findUnique({
                where: { id: user.offreId },
                include: {
                  meeting_test_meeting_test_offreIdTooffre_test: {
                    select: {
                      id: true,
                      status: true,
                      startAt: true,
                      numberOfMeeting: true,
                    },
                  },
                },
              })
              : null;

            return { allMeeting, meeting, offre, allOffresWithMeetings };
          });

          let updatedArray;
          if (allOffresWithMeetings) {
            updatedArray = allOffresWithMeetings.meeting_test_meeting_test_offreIdTooffre_test.filter(obj => obj.status !== "cancelled");
          }

          let userObject = {
            meetings: allMeeting,
            meeting: meeting,
            offre: offre,
            discovery: user.discovery,
            link: link,
            meetingsByUser: updatedArray ? updatedArray.sort((a: any, b: any) => a.numberOfMeeting - b.numberOfMeeting) : null
          };
          return NextResponse.json(
            {
              status: 200,
              body: userObject,
            },
            {
              status: 200,
            }
          );
        } catch {
          return NextResponse.json(
            {
              status: 400,
              message: "Impossible de récuperer les données, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
      }
    } else {
      return NextResponse.json(
        {
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
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
