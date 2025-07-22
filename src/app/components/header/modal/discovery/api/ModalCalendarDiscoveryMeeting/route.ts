import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(100, '60s'),
});

export async function GET(request: NextRequest) {
  try {
     const ip = request.ip ?? 'ip';
        const keyPrefix = "rlflx-header-discovery-get";
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
    const rateLimitResponse = await checkRateLimit(request, {
      points: 100,
      duration: 60,
      keyPrefix: "rlflx-header-discovery-get"
    });
    if (rateLimitResponse) return rateLimitResponse;
    const allMeeting = await prisma.meeting_test.findMany({
      where: { startAt: { gte: new Date() } },
      select: {
        startAt: true,
      },
    });
    let meetingObject = {
      meetings: allMeeting,
    };
    return NextResponse.json(
      {
        status: 200,
        body: meetingObject,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleError(error)
  }


}


