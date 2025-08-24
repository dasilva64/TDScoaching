import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { csrfToken } from "@/app/lib/csrfToken";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { handleError } from "@/app/lib/handleError";
import Stripe from "stripe";

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
                mail: true,
                id: true,
                offre_test: true,
                meetingId: true,
                firstname: true,
                lastname: true,
                discovery: true,
                meeting_test: true
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
                const stripe = new Stripe(
                  "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f" as string, {
                  apiVersion: '2022-11-15',
                  typescript: true
                }
                );
                const setupIntent = await stripe.setupIntents.retrieve(user?.offre_test?.stripeIntentId!);
                const customerId =
                  typeof setupIntent.customer === 'string' ? setupIntent.customer : setupIntent.customer?.id;

                if (typeof customerId === 'string') {
                  const paymentMethods = await stripe.paymentMethods.list({
                    customer: customerId,
                    type: 'card',
                  });
                  for (const pm of paymentMethods.data) {
                    await stripe.paymentMethods.detach(pm.id);
                  }
                  await stripe.customers.del(customerId);
                } else {
                  return NextResponse.json({
                    status: 400,
                    message: `Impossible de récupérer les données de paiement, veuillez réessayer`
                  });
                }
              } catch {
                return NextResponse.json({
                  status: 400,
                  message: `Erreur lors de la suppression des données de paiement, veuillez réessayer`
                });
              }
              try {
                const { updateUser, meetingByUser, meetingByOffre } = await prisma.$transaction(async (tx) => {
                  let updateMeeting = await prisma.meeting_test.update({
                    where: { id: user.meetingId! },
                    data: {
                      status: "completed",
                      status_payment: "free"
                    }
                  })
                  await prisma.offre_test.update({
                    where: { id: user?.offre_test!.id },
                    data: {
                      status: "completed"
                    }
                  })
                  let updateUser = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      meetingId: null,
                      offreId: null,
                    },
                    select: {
                      mail: true,
                      id: true,
                      offre_test: true,
                      meetingId: true,
                      firstname: true,
                      lastname: true,
                      discovery: true,
                      meeting_test: true
                    }
                  })
                  const meetingByUser = await prisma.meeting_test.findMany({
                    where: { userMail: user.mail },
                    select: {
                      startAt: true,
                    },
                  });
                  const allOffresWithMeetings = await prisma.offre_test.findMany({
                    where: { userId: user.id },
                    include: {
                      meeting_test_meeting_test_offreIdTooffre_test: {
                        select: {
                          id: true,
                          status: true,
                          startAt: true,
                          numberOfMeeting: true,
                          status_payment: true
                        },
                      },
                    }
                  });
                  let LastMeeting;
                  let meetingByOffre = [];
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
                      "Type de coaching": allOffresWithMeetings[i].coaching ? allOffresWithMeetings[i].coaching![0].toUpperCase() + allOffresWithMeetings[i].coaching!.slice(1,) : "Pas encore de coaching",
                      "Statut de l'offre": allOffresWithMeetings[i].status === "cancelled" ? "Annulé" : allOffresWithMeetings[i].status === "pending" ? "En cours" : "Terminé",
                      "Dernier rendez-vous": LastMeeting !== null && LastMeeting !== null ? new Date(LastMeeting.startAt).toLocaleString('fr') + " (" + allOffresWithMeetings[i].currentNumberOfMeeting!.toString() + "/" + (["discovery", "unique"].includes(allOffresWithMeetings[i].type) ? "1" : "4") + ")" : "Pas encore de rendez-vous",
                      meetings: updatedArray.sort((a: any, b: any) => a.numberOfMeeting - b.numberOfMeeting)
                    };
                    meetingByOffre.push(offreObject);
                  }
                  return { updateUser, meetingByUser, meetingByOffre }
                })
                let userObject = {
                  id: updateUser?.id,
                  firstname: updateUser?.firstname,
                  lastname: updateUser?.lastname,
                  mail: updateUser?.mail,
                  discovery: updateUser?.discovery,
                  allMeetings: meetingByUser,
                  meeting: updateUser?.meeting_test,
                  offre: updateUser?.offre_test,
                  meetingByOffre: meetingByOffre
                };
                return NextResponse.json({
                  status: 200,
                  body: userObject,
                  message: "Le rendez-vous a été finit"
                });
              } catch (error) {
                return NextResponse.json({
                  status: 400,
                  message: `Erreur : ${error}`
                });
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
