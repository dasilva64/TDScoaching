import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET() {
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

}


