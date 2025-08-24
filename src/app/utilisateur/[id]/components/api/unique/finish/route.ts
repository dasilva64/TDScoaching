import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import validator from "validator";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { csrfToken } from "@/app/lib/csrfToken";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-utilisateur-unique-finish');
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
    let adminUser = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (adminUser === null) {
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
      if (adminUser.role !== "ROLE_ADMIN") {
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
          /* const meetingById = await prisma.meeting_test.findMany({
            where: { userMail: user?.mail },
            take: 1,
            orderBy: {
              createdAt: 'desc'
            }
          }); */
          if (user?.meetingId === null) {
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

              const paymentIntent = await stripe.paymentIntents.create({
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
              await prisma.offre_test.update({
                where: { id: user?.offre_test!.id },
                data: {
                  stripeIntentId: paymentIntent.id
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
                const { meeting } = await prisma.$transaction(async (tx) => {
                  let meeting = await prisma.meeting_test.update({
                    where: { id: user?.meetingId! },
                    data: {
                      status: "completed"
                    }
                  })
                  await prisma.offre_test.update({
                    where: { id: user?.offre_test!.id },
                    data: {
                      status: "completed"
                    }
                  })
                  await prisma.user.update({
                    where: { id: user?.id },
                    data: {
                      meetingId: null,
                      offreId: null
                    }
                  })

                  return { meeting }
                })
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
                const meetingByUser = await prisma.meeting_test.findMany({
                  where: { userMail: user?.mail },
                  select: {
                    startAt: true,
                  },
                });

                let userObject = {
                  id: user?.id,
                  firstname: user?.firstname,
                  lastname: user?.lastname,
                  mail: user?.mail,
                  discovery: user?.discovery,
                  allMeetings: meetingByUser,
                  meeting: user?.meeting_test,
                  offre: user?.offre_test
                };
                return NextResponse.json({
                  status: 200,
                  body: userObject,
                  message: "Le paiement a été un succes et le rendez-vous est terminé"
                });
              } else {
                return NextResponse.json({
                  status: 400,
                  message: `Erreur lors du paiement`
                });
              }


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
}
