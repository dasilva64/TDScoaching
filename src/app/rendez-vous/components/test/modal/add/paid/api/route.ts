import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import Stripe from "stripe";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
      points: 5,
      duration: 60,
      keyPrefix: "rlflx-meet-add-paid"
    });
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
    if (session.isLoggedIn === true) {
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
        const { start, typeCoaching, pseudo } = (await request.json()) as {
          start: string;
          typeCoaching: string;
          pseudo: string;
        };
        let arrayMessageError = validationBody({
          start: start,
          typeCoaching: typeCoaching,
        });
        if (arrayMessageError.length > 0) {
          return NextResponse.json(
            {
              status: 400,
              type: "validation",
              message: arrayMessageError,
            },
            {
              status: 400,
            }
          );
        }
        if (pseudo.trim() !== "") {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message: "Vous ne pouvez pas créer un rendez-vous, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        if (user.meetingId !== null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà un rendez-vous de pris",
            },
            {
              status: 400,
            }
          );
        } else {
          let date = new Date(start);
          if (date < new Date()) {
            return NextResponse.json(
              {
                status: 400,
                message: "La date ne peut pas être dans le passé",
              },
              {
                status: 400,
              }
            );
          } else {

            const stripe = new Stripe(
              process.env.STRIPE as string, {
              apiVersion: '2022-11-15',
              typescript: true
            }
            );
            let offre = await prisma.offre_test.findUnique({
              where: {
                id: user.offreId!,
              },
            });
            if (offre === null) {
              return NextResponse.json(
                {
                  status: 404,
                  message:
                    "Sélectionnez une formule avant de prendre rendez-vous",
                },
                {
                  status: 404,
                }
              );
            } else {
              let stripeSession: any;
              try {
                stripeSession = await stripe.checkout.sessions.create({
                  line_items: [
                    {
                      price_data: {
                        currency: "eur",
                        product_data: {
                          name: offre.type !== 'flash' ? "Rendez-vous unique" : "Offre flash",
                          description: offre.type === "unique" ? `
              Date: ${new Date(start).toLocaleString("fr")} - 
              Type de coaching: ${offre.coaching}
            ` : `
              1er rendez-vous: ${new Date(start).toLocaleString("fr")} - 
              Type de coaching: ${offre.coaching} - 3×1h + bilan offert
            `,
                        },

                        unit_amount: offre.price!,
                      },

                      quantity: 1,
                    },
                  ],
                  mode: "payment",
                  customer_email: user?.mail,
                  locale: "fr",
                  payment_intent_data: { capture_method: "manual" },
                  success_url: `http://localhost:3000/redirection-vers-rendez-vous?result=success&session_id={CHECKOUT_SESSION_ID}`,
                  cancel_url: "http://localhost:3000/redirection-vers-rendez-vous?result=cancel",
                });
              } catch {
                return NextResponse.json({
                  status: 500,
                  message: "Erreur Stripe : impossible de créer la session de paiement"
                }, { status: 500 });
              }
              try {
                await prisma.$transaction(async (tx) => {
                  const createdMeeting = await tx.meeting_test.create({
                    data: {
                      startAt: start,
                      status: "pending",
                      userMail: user?.mail!,
                      numberOfMeeting: "1"
                    }
                  });

                  const updatedOffer = await tx.offre_test.update({
                    where: { id: user?.offreId! },
                    data: {
                      sessionId: stripeSession.id,
                      currentMeetingId: createdMeeting.id,
                      currentNumberOfMeeting: 1,
                      payment: false,
                      coaching: typeCoaching
                    }
                  });

                  await tx.meeting_test.update({
                    where: { id: createdMeeting.id },
                    data: {
                      offreId: updatedOffer.id
                    }
                  });

                  await tx.user.update({
                    where: { id: user?.id },
                    data: {
                      meetingId: createdMeeting.id
                    }
                  });
                });
                return NextResponse.json(
                  {
                    status: 200,
                    url: stripeSession.url,
                  },
                  {
                    status: 200,
                  }
                );
              } catch {
                return NextResponse.json(
                  {
                    status: 400,
                    message:
                      "Une erreur est survenue lors de la création du rendez-vous, veuillez réessayer",
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
    } else {
      return NextResponse.json(
        {
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez vous connecter",
        },
        {
          status: 401,
        }
      );
    }
  } catch (error: any) {
    return handleError(error)
  }
}
