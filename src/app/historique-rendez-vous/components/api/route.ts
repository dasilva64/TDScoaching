import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";

export async function GET() {
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
          status: 404,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 404,
        }
      );
    } else {
        let allMeetings = await prisma.meeting_test.findMany({
          where: { userMail: user.mail },
        });
        let copyAllMeetings: any = allMeetings;
        let allMeetingsObject = [];
        for (let i = 0; i < copyAllMeetings.length; i++) {
          let userObject = {
            start: copyAllMeetings[i].startAt,
            coaching: copyAllMeetings[i].coaching,
            confirm: copyAllMeetings[i].confirm,
            status: copyAllMeetings[i].status,
          };
          allMeetingsObject.push(userObject);
        }

        return NextResponse.json({
          status: 200,
         body: allMeetingsObject,
        });
      
    }
  }
}
