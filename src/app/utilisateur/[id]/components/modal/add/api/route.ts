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
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-utilisateur-add-meet');
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
          const { id, start } = (await request.json()) as {
            id: string;
            start: string
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
                id: true,
                mail: true,
                offreId: true,
                firstname: true,
                lastname: true,
                discovery: true,
                meeting_test: true,
                meetingId: true,
                offre_test: true
              }
            });
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
            if (user.offre_test?.type !== "flash") {
              return NextResponse.json(
                {
                  status: 404,
                  message: `Vous ne pouvez pas ajouter un autre rendez-vous, veuillez réessayer`,
                },
                {
                  status: 404,
                }
              );
            }
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
              let status_payment;
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
                const paymentMethodId =
                  typeof setupIntent.payment_method === 'string' ? setupIntent.payment_method : setupIntent.payment_method?.id;

                await stripe.paymentIntents.create({
                  amount: 10000,
                  currency: 'eur',
                  customer: customerId,
                  payment_method: paymentMethodId,
                  off_session: true,
                  confirm: true,
                });
                status_payment = 'completed'
                await prisma.meeting_test.update({
                  where: { id: user?.meeting_test!.id },
                  data: {
                    status_payment: "success"
                  }
                })
              } catch (error) {
                status_payment = 'failed'
                await prisma.meeting_test.update({
                  where: { id: user?.meeting_test!.id },
                  data: {
                    status_payment: "failed"
                  }
                })
                return NextResponse.json({
                  status: 400,
                  message: `Erreur : ${error}`
                });
              }
              try {
                if (status_payment === "completed") {
                  const { meetingByUser, allMeeting, meetingByOffre, editUser } = await prisma.$transaction(async (tx) => {

                    await prisma.meeting_test.update({
                      where: { id: user.meetingId! },
                      data: {
                        status: "completed"
                      }
                    })
                    const createMeet = await prisma.meeting_test.create({
                      data: {
                        startAt: start,
                        status: "not_confirmed",
                        userMail: user?.mail!,
                        offreId: user?.offreId,
                        status_payment: user.offre_test?.currentNumberOfMeeting === 4 ? "free" : "pending",
                        numberOfMeeting: (user?.offre_test?.currentNumberOfMeeting! + 1).toString()
                      }
                    });



                    await prisma.offre_test.update({
                      where: { id: user?.offreId! },
                      data: {
                        currentMeetingId: createMeet.id!,
                        currentNumberOfMeeting: user?.offre_test?.currentNumberOfMeeting! + 1
                      }
                    });
                    const editUser = await prisma.user.update({
                      where: { id: user?.id },
                      data: {
                        meetingId: createMeet.id!,
                      },
                      select: {
                        id: true,
                        mail: true,
                        offreId: true,
                        firstname: true,
                        lastname: true,
                        discovery: true,
                        meeting_test: true,
                        meetingId: true,
                        offre_test: true
                      }
                    });

                    const meetingByUser = await prisma.meeting_test.findMany({
                      where: { userMail: user?.mail },
                      select: { startAt: true },
                    });

                    const allMeeting = await prisma.meeting_test.findMany({
                      where: { startAt: { gte: new Date() } },
                      select: {
                        startAt: true,
                        userMail: true,
                      },
                    });

                    const allOffresWithMeetings = await prisma.offre_test.findMany({
                      where: { userId: user?.id },
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

                    let meetingByOffre: any[] = [];

                    for (let offre of allOffresWithMeetings) {
                      const LastMeeting = offre.currentMeetingId
                        ? await prisma.meeting_test.findUnique({ where: { id: offre.currentMeetingId } })
                        : null;

                      const filteredMeetings = offre.meeting_test_meeting_test_offreIdTooffre_test.filter(m => m.status !== "cancelled");

                      meetingByOffre.push({
                        "Type de l'offre": offre.type === "discovery" ? "Découverte" : offre.type[0].toUpperCase() + offre.type.slice(1),
                        "Type de coaching": offre.coaching ? offre.coaching[0].toUpperCase() + offre.coaching.slice(1) : "Pas encore de coaching",
                        "Statut de l'offre": offre.status === "cancelled" ? "Annulé" : offre.status === "pending" ? "En cours" : "Terminé",
                        "Dernier rendez-vous": LastMeeting
                          ? new Date(LastMeeting.startAt).toLocaleString('fr') + ` (${offre.currentNumberOfMeeting}/${["discovery", "unique"].includes(offre.type) ? "1" : "4"})`
                          : "Pas encore de rendez-vous",
                        meetings: filteredMeetings.sort((a, b) => a.numberOfMeeting.localeCompare(b.numberOfMeeting))
                      });
                    }

                    return { meetingByUser, allMeeting, meetingByOffre, editUser };
                  });

                  const userObject = {
                    id: editUser?.id,
                    firstname: editUser?.firstname,
                    lastname: editUser?.lastname,
                    mail: editUser?.mail,
                    discovery: editUser?.discovery,
                    allMeetings: meetingByUser,
                    meeting: editUser?.meeting_test,
                    offre: editUser?.offre_test,
                    meetings: allMeeting,
                    meetingByOffre: meetingByOffre
                  };

                  return NextResponse.json({
                    status: 200,
                    body: userObject,
                    message: "Le rendez-vous a été ajouté"
                  });
                }
                else {
                  return NextResponse.json({
                    status: 400,
                    message: `Erreur lors du paiement`
                  });
                }


              } catch {
                return NextResponse.json(
                  {
                    status: 400,
                    message: "Erreur lors de l'ajouter du rendez-vous, veuillez réessayer",
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
