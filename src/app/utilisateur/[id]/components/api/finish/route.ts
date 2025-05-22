import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const csrfToken = headers().get("x-csrf-token");

  if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
    return NextResponse.json(
      { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
      { status: 403 }
    );
  }
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
              message: "L'identifiant du rendez-vous est invalide",
            },
            {
              status: 400,
            }
          );
        } else {
          const user = await prisma.user.findUnique({
            where: {id : id},
            select: {
              mail: true
            }
          })
          const meetingById = await prisma.meeting_test.findMany({
            where: { userMail: user?.mail },
            take: 1,
            orderBy: {
              createdAt: 'desc'
            }
          });
          if (meetingById === null) {
            return NextResponse.json(
              {
                status: 404,
                message: `Le rendez-vous avec l'id : ${id} n'a pas été trouvé, veuillez réessayer`,
              },
              {
                status: 404,
              }
            );
          } else {
            let updateMeeting = await prisma.meeting_test.update({
              where: {id: meetingById[0].id},
              data: {
                status: "finish"
              }
            })
            let updateUser = await prisma.user.update({
                where: {meetingId: meetingById[0].id },
                data: {
                    meetingId: null,
                    discovery: false
                }
            })
            const userById = await prisma.user.findUnique({
              where: { id: id },
              include: {
                offre_test: true,
                meeting_test: true
              }
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
              const meetingByUser = await prisma.meeting_test.findMany({
                where: { userMail: validator.escape(userById.mail) },
                select: {
                  startAt: true,
                  coaching: true,
                  type: true
                },
              });
  
              let userObject = {
                id: validator.escape(userById.id),
                firstname: validator.escape(userById.firstname),
                lastname: validator.escape(userById.lastname),
                mail: validator.escape(userById.mail),
                discovery: userById.discovery,
                allMeetings: meetingByUser,
                meeting: userById.meeting_test,
                offre: userById.offre_test
              };
              return NextResponse.json({
                status: 200,
                body: userObject,
                message: "Le rendez-vous a été supprimé"
              });
            }
          }
        }
      }
    }
  }
}
