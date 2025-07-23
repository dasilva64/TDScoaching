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
    const keyPrefix = "rlflx-header-ui";
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

      return NextResponse.json({
        isLoggedIn: false,
      });
    } else {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        return NextResponse.json({
          isLoggedIn: false,
        });
      } else {
        return NextResponse.json({
          isLoggedIn: true,
          role: user.role,
          discovery: user.discovery,
          meeting: user.meetingId
        });
      }
    }
  } catch (error) {
    return handleError(error)
  }

}