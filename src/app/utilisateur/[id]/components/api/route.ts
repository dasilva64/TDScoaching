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
            const allMeeting = await prisma.meeting_test.findMany({
              where: { startAt: { gte: new Date() } },
              select: {
                startAt: true,
                userMail: true,
              },
            });
            const allOffresWithMeetings = await prisma.offre_test.findMany({
              where: { userId: userById.id },
              include: {
                meeting_test_meeting_test_offreIdTooffre_test: {
                  select: {
                    id: true,
                    status: true,
                    startAt: true,
                    numberOfMeeting: true
                  },
                },
              }
            });
            let LastMeeting
                  let objet = [];
                  for (let i = 0; i < allOffresWithMeetings.length; i++) {
                    if (allOffresWithMeetings[i].currentMeetingId === null) {
                      LastMeeting = null
                    } else {
                      LastMeeting = await prisma.meeting_test.findUnique({
                      where: { id: allOffresWithMeetings[i].currentMeetingId! }
                    })
                    }
                    const updatedArray = allOffresWithMeetings[i].meeting_test_meeting_test_offreIdTooffre_test.filter(obj => obj.status !== "cancelled");
                    let offreObject: any = {
                      "Type de l'offre": allOffresWithMeetings[i].type === "discovery" ? "Découverte" : allOffresWithMeetings[i].type[0].toUpperCase() + allOffresWithMeetings[i].type.slice(1),
                      "Type de coaching":  allOffresWithMeetings[i].coaching ? allOffresWithMeetings[i].coaching![0].toUpperCase() + allOffresWithMeetings[i].coaching!.slice(1,) : "Pas encore de coaching",
                      "Statut du paiement":  allOffresWithMeetings[i].type === "discovery" ? "Gratuit" : allOffresWithMeetings[i].payment === true ? "Payé" : "Non payé",
                      "Dernier rendez-vous": LastMeeting !== null && LastMeeting !== null ? new Date(LastMeeting.startAt).toLocaleString('fr') + " (" + allOffresWithMeetings[i].currentNumberOfMeeting!.toString() + "/" + (["discovery", "unique"].includes(allOffresWithMeetings[i].type) ? "1" : "3") + ")" : "Pas encore de rendez-vous",
                      meetings: updatedArray.sort((a: any, b: any) => a.numberOfMeeting - b.numberOfMeeting)
                    };
                    objet.push(offreObject);
                  }
            let userObject = {
              id: userById.id,
              firstname: userById.firstname,
              lastname: userById.lastname,
              mail: userById.mail,
              discovery: userById.discovery,
              allMeetings: meetingByUser,
              meeting: userById.meeting_test,
              offre: userById.offre_test,
              meetings: allMeeting,
              test: objet

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
