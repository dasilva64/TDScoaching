import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import prisma from "../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../lib/session";

export async function POST(request: NextRequest) {
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
        const { id } = (await request.json()) as {
          id: string;
        };
        if (validator.isUUID(id) !== true) {
          return NextResponse.json(
            {
              status: 400,
              message: "L'identifiant de l'utilisateur est invalide",
            },
            {
              status: 400,
            }
          );
        } else {
          const userById = await prisma.user.findUnique({
            where: { id: id },
          });
          if (userById === null) {
            return NextResponse.json(
              {
                status: 404,
                message: `L'utilisateur avec l'id : ${id} n'a pas été trouvé, veuillez réessayer`,
              },
              {
                status: 404,
              }
            );
          } else {
            let meeting;
            if (userById.meetingId === null) {
              meeting = null;
            } else {
              let meetingByUser = await prisma.meeting.findUnique({
                where: { id: validator.escape(userById.meetingId) },
              });
              if (meetingByUser === null) {
                let editUser = await prisma.user.update({
                  where: {
                    id: validator.escape(userById.id),
                    status: true,
                  },
                  data: {
                    meetingId: null,
                  },
                });
                meeting = null;
              } else {
                meeting = meetingByUser;
              }
            }
            const meetingByUser = await prisma.meeting.findMany({
              where: { userId: validator.escape(userById.id) },
              select: {
                startAt: true,
                typeMeeting: true,
              },
            });

            let userObject = {
              id: validator.escape(userById.id),
              firstname: validator.escape(userById.firstname),
              lastname: validator.escape(userById.lastname),
              mail: validator.escape(userById.mail),
              discovery: userById.discovery,
              allMeetings: meetingByUser,
              meeting: meeting,
              typeMeeting: userById.typeMeeting,
            };
            return NextResponse.json({
              status: 200,
              body: userObject,
            });
          }
        }
      }
    }
  }
}
