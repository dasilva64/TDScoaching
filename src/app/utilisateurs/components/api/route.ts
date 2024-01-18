import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  defaultSession,
  sessionOptions,
} from "../../../../../lib/session";
import prisma from "../../../../../lib/prisma";
import validator from "validator";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn !== true) {
    return Response.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      { status: 401 }
    );
  } else {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      return Response.json(
        {
          status: 404,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        { status: 404 }
      );
    } else {
      if (user.role !== "ROLE_ADMIN") {
        return Response.json(
          {
            status: 403,
            message: "Vous n'avez pas accès à cette page, veuillez réessayer",
          },
          { status: 403 }
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
            id: copyAllUser[i].id,
            mail: copyAllUser[i].mail,
            firstName: copyAllUser[i].firstname,
            lastName: copyAllUser[i].lastname,
            phone: copyAllUser[i].phone,
            allMeeting: copyAllUser[i].Meeting,
            idMeeting: copyAllUser[i].meetingId,
          };
          allUserObject.push(userObject);
        }

        return Response.json({
          status: 200,
          body: allUserObject,
        });
      }
    }
  }
}
