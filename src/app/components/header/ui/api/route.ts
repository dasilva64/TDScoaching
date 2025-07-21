import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
      points: 10000,
      duration: 60,
      keyPrefix: "rlflx-header-ui"
    });
    if (rateLimitResponse) return rateLimitResponse;
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
    handleError(error)
  }

}