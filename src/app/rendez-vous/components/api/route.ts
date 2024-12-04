/* import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  defaultSession,
  sessionOptions,
} from "../../../../../lib/session";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn === true) {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(
        {
          status: 404,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 404,
        }
      );
    } else {
      let link = null;
      const allMeeting = await prisma.meeting.findMany({
        where: { startAt: { gte: new Date() } },
        select: {
          startAt: true,
          userId: true,
        },
      });
      let meeting;
      if (user.meetingId === null) {
        meeting = null;
      } else {
        meeting = await prisma.meeting.findUnique({
          where: {
            id: user.meetingId,
          },
        });
      }
      if (meeting !== null) {
        let current = new Date();
        let meetingDate = new Date(meeting.startAt);
        let dateSendLink = meetingDate.setHours(meetingDate.getHours() - 48);
        if (current.getTime() > dateSendLink) {
          link = "https://www.google.com/?client=safari&channel=mac_bm";
        } else {
          link = null;
        }
      } else {
        link = null;
      }
      let userObject = {
        meetings: allMeeting,
        meeting: meeting,
        typeMeeting: user.typeMeeting,
        discovery: user.discovery,
        link: link,
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
  } else {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      {
        status: 401,
      }
    );
  }
}
 */