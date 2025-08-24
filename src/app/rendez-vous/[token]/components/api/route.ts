import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-meet-token');
  if (rateLimitResponse) return rateLimitResponse;
  const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
  /* const csrfTokenHeader = headers().get("x-csrf-token");
  const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
  if (csrfCheckResponse) return csrfCheckResponse;
  */
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
          id: true,
          User: {
            select: {
              id: true
            }
          }
        }
      })
      if (meet === null) {
        return NextResponse.json(
          {
            status: 401,
            message: "Le rendez-vous n'a pas été trouvé, veuillez réessayer",
          },
          {
            status: 401,
          }
        );
      } else {
        try {
          const user = await prisma.user.findUnique({
            where: { mail: decodeToken.user },
            select: {
              id: true,
              meetingId: true,
              meeting_test: {
                select: {
                  startAt: true,
                  status: true,
                },
              },
              offre_test: {
                select: {
                  coaching: true,
                  currentNumberOfMeeting: true,
                },
              },
            },
          });

          if (!user) {
            return NextResponse.json(
              {
                status: 400,
                message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
              },
              { status: 400 }
            );
          }
          if (user.meetingId === null) {
            return NextResponse.json(
              {
                status: 401,
                message: "Le rendez-vous n'a pas été trouvé, veuillez réessayer",
              },
              {
                status: 401,
              }
            );
          }

          const allMeeting = await prisma.meeting_test.findMany({
            where: {
              startAt: { gte: new Date() },
              status: { not: "cancelled" },
            },
            select: {
              startAt: true,
              id: true,
              User: {
                select: {
                  id: true
                }
              }
            },
          });
          const userObject = {
            id: user.id,
            meetings: allMeeting,
            meeting: user.meeting_test ?? null,
            offre: user.offre_test ?? null,
            link: null,
          };

          return NextResponse.json(
            {
              status: 200,
              message: "Le rendez-vous a été trouvé",
              body: userObject,
            },
            { status: 200 }
          );
        } catch (error: any) {
          return NextResponse.json(
            {
              status: 500,
              message: "Une erreur est survenue, veuillez réessayer",
            },
            { status: 500 }
          );
        }


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
