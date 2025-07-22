import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { csrfToken } from "@/app/lib/csrfToken";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? 'ip';
  const keyPrefix = "rlflx-utilisateur-add-meet";
  const key = `${keyPrefix}:${ip}`
  const { success, remaining } = await ratelimit.limit(key);

  if (!success) {
    return NextResponse.json(
      {
        status: 429,
        message: "Trop de requêtes, veuillez réessayer plus tard",
      },
      { status: 429 }
    );
  }
  const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
  const csrfTokenHeader = headers().get("x-csrf-token");
  const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
  if (csrfCheckResponse) return csrfCheckResponse;
  if (session.isLoggedIn !== true) {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      {
        status: 401,
      }
    );
  } else {
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
      if (user.role !== "ROLE_ADMIN") {
        return NextResponse.json(
          {
            status: 401,
            message: "Vous n'avez pas accès à cette page, veuillez réessayer",
          },
          {
            status: 401,
          }
        );
      } else {
        const { id, start } = (await request.json()) as {
          id: string;
          start: string
        };
        if (validator.isUUID(id) !== true) {
          return NextResponse.json(
            {
              status: 400,
              message: "L'identifiant de l'utilisateur est invalide",
            },
            {
              status: 400,
            }
          );
        } else {
          const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
              id: true,
              mail: true,
              offreId: true,
              meetingId: true
            }
          })
          const userById = await prisma.user.findUnique({
            where: { id: id },
            include: {
              offre_test: true,
              meeting_test: true
            }
          });
          const createMeet = await prisma.meeting_test.create({
            data: {
              startAt: start,
              status: "pending",
              userMail: user?.mail!,
              offreId: user?.offreId,
              numberOfMeeting: (userById?.offre_test?.currentNumberOfMeeting! + 1).toString()

            }
          })


          let updateMeeting = await prisma.meeting_test.update({
            where: { id: user?.meetingId! },
            data: {
              status: "completed"
            }
          })

          let updateUser = await prisma.user.update({
            where: { id: user?.id },
            data: {
              meetingId: createMeet.id!,
            }
          })
          if (updateUser === null) {
            return NextResponse.json(
              {
                status: 404,
                message: `nlllsllslsllslls`,
              },
              {
                status: 404,
              }
            );
          }

          const editOffre = await prisma.offre_test.update({
            where: { id: user?.offreId! },
            data: {
              currentMeetingId: createMeet.id!,
              currentNumberOfMeeting: userById?.offre_test?.currentNumberOfMeeting! + 1
            }
          })
          if (userById === null) {
            return NextResponse.json(
              {
                status: 404,
                message: `L'utilisateur avec l'id : ${id} n'a pas été trouvé, veuillez réessayer`,
              },
              {
                status: 404,
              }
            );
          } else {
            const meetingByUser = await prisma.meeting_test.findMany({
              where: { userMail: userById.mail },
              select: {
                startAt: true,
              },
            });

            let userObject = {
              id: userById.id,
              firstname: userById.firstname,
              lastname: userById.lastname,
              mail: userById.mail,
              discovery: userById.discovery,
              allMeetings: meetingByUser,
              meeting: userById.meeting_test,
              offre: userById.offre_test
            };
            return NextResponse.json({
              status: 200,
              body: userObject,
              message: "Le rendez-vous a été supprimé"
            });
            //}
          }
        }
      }
    }
  }
}
