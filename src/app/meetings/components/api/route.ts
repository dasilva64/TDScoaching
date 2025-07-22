import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(100, '60s'),
});

export async function GET(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
    const keyPrefix = "rlflx-meetings-get";
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
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

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
          const allMeeting = await prisma.meeting_test.findMany({
            select: {
              startAt: true,
              userMail: true,
              User_meeting_test_userMailToUser: true

            },
          });

          let userObject = {
            meetings: allMeeting,
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
        }
      }
    }
  } catch (error) {
    return handleError(error)
  }

}