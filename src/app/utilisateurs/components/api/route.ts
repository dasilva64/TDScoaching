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
        let allUser = await prisma.user.findMany({
          where: { role: "ROLE_USER" },
          /* include: {
            Meeting: {
              select: {
                id: true,
                startAt: true,
              },
            },
          }, */
        });
        let copyAllUser: any = allUser;
        let allUserObject = [];
        for (let i = 0; i < copyAllUser.length; i++) {
          let userObject = {
            id: copyAllUser[i].id,
            mail: copyAllUser[i].mail,
            firstName: copyAllUser[i].firstname,
            lastName: copyAllUser[i].lastname,
            /* allMeeting: copyAllUser[i].Meeting),
            idMeeting: copyAllUser[i].meetingId), */
          };
          allUserObject.push(userObject);
        }

        return NextResponse.json({
          status: 200,
          body: allUserObject,
        });
      }
    }
  }
}
