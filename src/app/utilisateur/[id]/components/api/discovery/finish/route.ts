import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { csrfToken } from "@/app/lib/csrfToken";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
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
                meetingId: true,
                meeting_test: true,
                id: true,
                mail: true,
                offreId:true, 
                offre_test: true
              }
            })
            if (user === null) {
              return NextResponse.json(
                {
                  status: 404,
                  message: `L'utilisateur avec l'id : ${id} n'a pas été trouvé, veuillez réessayer`,
                },
                {
                  status: 404,
                }
              );
            }
            if (user?.meetingId === null) {
              return NextResponse.json(
                {
                  status: 404,
                  message: `L'utilisateur actuel n'a aucun rendez-vous en cours, veuillez réessayer`,
                },
                {
                  status: 404,
                }
              );
            } else {
              if (user?.meeting_test?.status === "not_confirmed") {
              return NextResponse.json(
                {
                  status: 404,
                  message: `Le rendez-vous de l'utilisateur n'est pas encore confirmé, veuillez réessayer`,
                },
                {
                  status: 404,
                }
              );
            }
              try {
                const { meetingByUser, updateUser } = await prisma.$transaction(async (tx) => {
                  let updateMeeting = await prisma.meeting_test.update({
                    where: { id: user.meetingId! },
                    data: {
                      status: "completed",
                      token: ""
                    }
                  })
                   let updateOffre = await prisma.offre_test.update({
                    where: { id: user.offreId! },
                    data: {
                      status: "completed",
                    }
                  })
                  let updateUser = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      meetingId: null,
                      offreId: null,
                      discovery: false,
                    },
                    select: {
                      id: true,
                      firstname: true,
                      lastname: true,
                      mail: true,
                      discovery: true,
                      meeting_test: true,
                      offre_test: true
                    }
                  })
                  let meetingByUser = await prisma.meeting_test.findMany({
                    where: { userMail: user.mail },
                    select: {
                      startAt: true,
                    },
                  });
                  return { meetingByUser, updateUser }
                })
                let userObject = {
                  id: updateUser.id,
                  firstname: updateUser.firstname,
                  lastname: updateUser.lastname,
                  mail: updateUser.mail,
                  discovery: updateUser.discovery,
                  allMeetings: meetingByUser,
                  meeting: updateUser.meeting_test,
                  offre: updateUser.offre_test
                };
                return NextResponse.json({
                  status: 200,
                  body: userObject,
                  message: "Le rendez-vous a été terminé"
                });
              }
              catch (error) {
                return NextResponse.json(
                  {
                    status: 400,
                    message: "Erreur lors de la fin du rendez-vous, veuillez réessayer",
                  },
                  {
                    status: 400,
                  }
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    return handleError(error)
  }
}
