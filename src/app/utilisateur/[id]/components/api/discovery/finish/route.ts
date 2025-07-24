import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { csrfToken } from "@/app/lib/csrfToken";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-utilisateur-discovery-finish');
  if (rateLimitResponse) return rateLimitResponse;
  const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
  const csrfTokenHeader = headers().get("x-csrf-token");
  const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
  if (csrfCheckResponse) return csrfCheckResponse;
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
          status: 401,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 401,
        }
      );
    } else {
      if (user.role !== "ROLE_ADMIN") {
        return NextResponse.json(
          {
            status: 401,
            message: "Vous n'avez pas accès à cette page, veuillez réessayer",
          },
          {
            status: 401,
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
          const user = await prisma.user.findUnique({
            where: { id: id },
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
              where: { id: meetingById[0].id },
              data: {
                status: "completed"
              }
            })
            let updateUser = await prisma.user.update({
              where: { meetingId: meetingById[0].id },
              data: {
                meetingId: null,
                offreId: null,
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
                where: { userMail: userById.mail },
                select: {
                  startAt: true,
                },
              });

              let userObject = {
                id: userById.id,
                firstname: userById.firstname,
                lastname: userById.lastname,
                mail: userById.mail,
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
