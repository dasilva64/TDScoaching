import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimit } from "@/app/lib/rateLimiter";

export async function GET(request: NextRequest) {
  try {
   /*  const rateLimitResponse = await checkRateLimit(request, {
      points: 100,
      duration: 60,
      keyPrefix: "rlflx-header-discovery-get"
    });
    if (rateLimitResponse) return rateLimitResponse; */
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


