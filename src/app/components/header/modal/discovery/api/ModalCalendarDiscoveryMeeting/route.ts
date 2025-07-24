import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimitLong } from "@/app/lib/rateLimiter";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitLong(request, 'rlflx-header-discovery-get');
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


