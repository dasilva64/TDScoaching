import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, {
    points: 5,
    duration: 60,
    keyPrefix: "rlflx-meet-token"
  });
  if (rateLimitResponse) return rateLimitResponse;
  const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
  const csrfTokenHeader = headers().get("x-csrf-token");
  const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
  if (csrfCheckResponse) return csrfCheckResponse;
  if (session.isLoggedIn) {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'avez pas accès à cette route, veuillez réessayer"

      },
      {
        status: 401
      }
    )
  }
  const { token } =
    (await request.json()) as {
      token: string;
    };

  if (token === null) {
    return NextResponse.json(
      {
        status: 400,
        message: "Le token n'est pas valide, veuillez réessayer",
      },
      {
        status: 400,
      }
    );
  } else {
    const { verify } = jwt;
    try {
      const decodeToken: any = verify(token.trim(),
        process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
      );
      const meet = await prisma.meeting_test.findUnique({
        where: {
          id: decodeToken.id
        },
        select: {
          startAt: true,
          userMail: true,
        }
      })
      if (meet === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "Le rendez-vous n'a pas été trouvé, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        /* const allMeeting = await prisma.meeting_test.findMany({
          where: { startAt: { gte: new Date() } },
          select: {
            startAt: true,
            userMail: true,
          },
        }) */
        const user = await prisma.user.findUnique({
          where: {
            mail: decodeToken.user
          }
        })
        if (user === null) {
          return NextResponse.json(
            {
              status: 400,
              message: "L'utilisateur' n'a pas été trouvé, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
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
          link: null,
          meetingsByUser: updatedArray ? updatedArray.sort((a: any, b: any) => a.numberOfMeeting - b.numberOfMeeting) : null
        };
        return NextResponse.json(
          {
            status: 200,
            message: "Le rendez-vous a été trouvé",
            body: userObject,
          },
          {
            status: 200,
          }
        );
      }

    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json(
          { status: 400, message: "Le token a expiré, veuillez en générer un nouveau." },
          { status: 400 }
        );
      } else if (err.name === "JsonWebTokenError") {
        return NextResponse.json(
          { status: 400, message: "Le token est invalide." },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { status: 400, message: "Une erreur inconnue est survenue." },
          { status: 400 }
        );
      }
    }

  }
}
