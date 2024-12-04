import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  defaultSession,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import validator from "validator";

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
      where: { id: validator.escape(session.id) },
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
          include: {
            Meeting: {
              select: {
                id: true,
                startAt: true,
              },
            },
          },
        });
        let copyAllUser: any = allUser;
        let allUserObject = [];
        for (let i = 0; i < copyAllUser.length; i++) {
          let userObject = {
            id: validator.escape(copyAllUser[i].id),
            mail: validator.escape(copyAllUser[i].mail),
            firstName: validator.escape(copyAllUser[i].firstname),
            lastName: validator.escape(copyAllUser[i].lastname),
            allMeeting: validator.escape(copyAllUser[i].Meeting),
            idMeeting: validator.escape(copyAllUser[i].meetingId),
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
