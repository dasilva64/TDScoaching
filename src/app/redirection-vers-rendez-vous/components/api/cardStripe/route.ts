import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-meet-add-paid');
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
        include: {
          offre_test: true
        }
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
        const { setup_intent } = (await request.json()) as {
          setup_intent: string;
        };
        try {
          if (!setup_intent) {
            return NextResponse.json({ status: 400, message: "setup_intent manquant" }, { status: 400 });
          }

          const stripe = new Stripe(process.env.STRIPE!, { apiVersion: '2022-11-15' });
          const intent = await stripe.setupIntents.retrieve(setup_intent);

          if (intent.status === "succeeded") {
            return NextResponse.json({
              status: 200,
              message: "✅ Carte enregistrée et rendez-vous confirmé",
            });
          } else {
            return NextResponse.json({
              status: 400,
              message: `❌ La carte n’a pas pu être enregistrée. Statut : ${intent.status}`,
            });
          }
          /* if (user.offre_test) {
            if (user.offre_test.type === "unique") {
              const stripe = new Stripe(
                process.env.STRIPE as string, {
                apiVersion: '2022-11-15',
                typescript: true
              }
              );
              const setupIntent = await stripe.setupIntents.retrieve(setup_intent);
              if (setupIntent.status === "succeeded") {
                try {
                  await prisma.$transaction(async (tx) => {
                    await prisma.offre_test.update({
                      where: { id: user.offreId! },
                      data: {
                        stripeIntentId: setup_intent,
                        hasCard: true,
                      },
                    });
                  });
                } catch (err) {
                  return NextResponse.json({
                    status: 500,
                    message: "Erreur interne lors de l'enregistrement de la carte",
                  });
                }


                return NextResponse.json({
                  status: 200,
                  message: "Votre carte a bien été ajoutée et le rendez-vous est confirmé",
                });
              } else {
                await prisma.meeting_test.update({
                  where: { id: user.offreId! },
                  data: {
                    status_payment: setupIntent.status.toUpperCase(),
                  },
                });

                return NextResponse.json({
                  status: 400,
                  message: "La carte n’a pas pu être enregistrée. Veuillez réessayer.",
                });
              }
            } else if (user.offre_test.type === 'flash') {
              const stripe = new Stripe(
                process.env.STRIPE as string, {
                apiVersion: '2022-11-15',
                typescript: true
              }
              );
              const setupIntent = await stripe.setupIntents.retrieve(setup_intent);
              if (setupIntent.status === "succeeded") {
                await prisma.$transaction(async (tx) => {
                  await prisma.offre_test.update({
                    where: { id: user.offreId! },
                    data: {
                      stripeIntentId: setup_intent,
                      hasCard: true,
                    },
                  });
                });

                return NextResponse.json({
                  status: 200,
                  message: "Votre carte a bien été ajoutée et le rendez-vous est confirmé",
                });
              } else {

                return NextResponse.json({
                  status: 400,
                  message: "La carte n’a pas pu être enregistrée. Veuillez réessayer.",
                });
              }
            } else {
              return NextResponse.json(
                {
                  status: 400,
                  message: "L'offre selectionné n'existe pas, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }
          } else {
            return NextResponse.json(
              {
                status: 400,
                message:
                  "L'offre n'a pas été trouvé, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } */

        } catch {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Une erreur est survenue lors de l'ajout de votre carte, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        /* let arrayMessageError = validationBody({
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
        } */

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
