import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
  } else  {
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
      if (user.role !== "ROLE_ADMIN") {
        return NextResponse.json(
          {
            status: 403,
            message: "Vous n'avez pas accès à cette page, veuillez réessayer",
          },
          {
            status: 403,
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
  }