import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import validator, { isDate } from "validator";
import bcrypt from "bcrypt";
import { RateLimiter } from "limiter";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import Stripe from "stripe";

const limiter = new RateLimiter({
  tokensPerInterval: 600,
  interval: "hour",
  fireImmediately: true,
});

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn === true) {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        meeting_test: true,
        offre_test: true,
      },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(
        {
          status: 400,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 400,
        }
      );
    } else {
      if (user.meetingId === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "Vous n'avez aucun rendez-vous en cours",
          },
          {
            status: 400,
          }
        );
      } else {
        const stripe = new Stripe(
          "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f"
        );
        let offre = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            offre_test: true,
            meeting_test: true,
          },
        });
        if (offre) {
          if (offre.offre_test?.sessionId) {
            try {
              let stripeSession = await stripe.checkout.sessions.retrieve(
                offre.offre_test?.sessionId
              );
              return NextResponse.json(
                {
                  status: 200,
                  url: stripeSession.url,
                },
                {
                  status: 200,
                }
              );
            } catch (error) {
              const offreEdit = await prisma.offre_test.update({
                where: {
                  id: user.offreId!
                },
                data: {
                  sessionId: null
                }
              })
              return NextResponse.json(
                {
                  status: 404,
                  message: "La session du paiement n'a pas été trouvé, veuillez réessayer",
                },
                {
                  status: 404,
                }
              );
            }
          }

          let price;
          if (offre.offre_test?.type === "flash") {
            price = 30000;
          } else if (offre.offre_test?.type === "longue") {
            price = 100000;
          } else if (offre.offre_test?.type === "unique") {
            price = 10000;
          }
          let session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: "eur",
                  product_data: {
                    name: "Rendez-vous unique",
                    description: `
                  Date: ${new Date(user.meeting_test?.startAt!).toLocaleString(
                    "fr"
                  )} - 
                  Type de coaching: couple
                `,
                  },

                  unit_amount: price,
                },

                quantity: 1,
              },
            ],
            mode: "payment",
            customer_email: user?.mail,
            locale: "fr",
            payment_intent_data: { capture_method: "manual" },
            success_url: `http://localhost:3000/api?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:3000/rendez-vous",
          });
          const update = await prisma.offre_test.update({
            where: {
              id: user.offreId!,
            },
            data: {
              sessionId: session.id,
            },
          })
          return NextResponse.json(
            {
              status: 200,
              url: session.url,
            },
            {
              status: 200,
            }
          );
        } else {
          return NextResponse.json(
            {
              status: 404,
              message: "Sélectionnez une formule avant de prendre rendez-vous",
            },
            {
              status: 404,
            }
          );
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
}
