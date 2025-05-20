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
      const { start, typeCoaching } = (await request.json()) as {
        start: string;
        typeCoaching: string;
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
            "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f" as string, {
              apiVersion: '2022-11-15',
              typescript: true
          }
          );
          let offre = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            include: {
              offre_test: true,
            },
          });
          let price;
          if (offre?.offre_test?.type === "flash") {
            price = 30000;
          } else if (offre?.offre_test?.type === "longue") {
            price = 100000;
          } else if (offre?.offre_test?.type === "unique") {
            price = 10000;
          } else {
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
          }
          let session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: "eur",
                  product_data: {
                    name: "Rendez-vous unique",
                    description: `
              Date: ${new Date(start).toLocaleString("fr")} - 
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
            try {
              const transaction = await prisma.$transaction([
                prisma.meeting_test.create({
                  data: {
                    startAt: start,
                    status: validator.escape("pending"),
                    userMail: user.mail,
                    confirm: false,
                    coaching: typeCoaching,
                    type: offre?.offre_test?.type,
                  },
                }),
                prisma.offre_test.update({
                  where: {
                    id: user.offreId!,
                  },
                  data: {
                    sessionId: session.id,
                  },
                }),
                /* prisma.user.update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    meetingId: createMeeting.id,
                  },
                }), */
              ]);
              const update = await prisma.user.update({
                where: {
                  id: user.id,
                },
                data: {
                  meetingId: transaction[0].id,
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
