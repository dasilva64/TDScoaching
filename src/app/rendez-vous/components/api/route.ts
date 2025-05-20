import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";

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
      const allMeeting = await prisma.meeting_test.findMany({
        where: { startAt: { gte: new Date() } },
        select: {
          startAt: true,
          userMail: true,
        },
      });
      let meeting;
      if (user.meetingId === null) {
        meeting = null;
      } else {
        meeting = await prisma.meeting_test.findUnique({
          where: {
            id: user.meetingId,
          },
        });
      }
      let offre;
      if (user.offreId === null){
        offre = null
      } else {
        offre = await prisma.offre_test.findUnique({
          where:{
            id: user.offreId
          }
        })
      }
      let userObject = {
        meetings: allMeeting,
        meeting: meeting,
        offre: offre,
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
