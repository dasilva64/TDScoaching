import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import Stripe from "stripe";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});


export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
    const keyPrefix = "rlflx-meet-confirm-paid";
    const key = `${keyPrefix}:${ip}`
    const { success, remaining } = await ratelimit.limit(key);

    if (!success) {
      return NextResponse.json(
        {
          status: 429,
          message: "Trop de requêtes, veuillez réessayer plus tard",
        },
        { status: 429 }
      );
    }
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
          meeting_test: true,
          offre_test: true,
        },
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
            "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f" as string, {
            apiVersion: '2022-11-15',
            typescript: true
          }
          );
          let offre = await prisma.offre_test.findUnique({
            where: { id: user.offreId! }
          })
          /*let test = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            include: {
              offre_test: true,
              meeting_test: true,
            },
          }); */
          if (offre) {
            if (offre.sessionId) {
              try {
                let stripeSession = await stripe.checkout.sessions.retrieve(
                  offre.sessionId
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
                    message: "Erreur Stripe : impossible de retrouver la session de paiement",
                  },
                  {
                    status: 404,
                  }
                );
              }
            }
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
              Date: ${new Date(user.meeting_test?.startAt!).toLocaleString("fr")} - 
              Type de coaching: ${offre.coaching}
            ` : `
              1er rendez-vous: ${new Date(user.meeting_test?.startAt!).toLocaleString("fr")} - 
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
                await prisma.offre_test.update({
                  where: {
                    id: user?.offreId!,
                  },
                  data: {
                    sessionId: stripeSession.id,
                  },
                })
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
                    "Une erreur est survenue lors de la confirmation du rendez-vous, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }
          } else {
            return NextResponse.json(
              {
                status: 404,
                message: "Aucune offre en cours, veuillez réessayer",
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
  } catch (error: any) {
    return handleError(error)
  }
}


/* let session = await stripe.checkout.sessions.create({
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
              success_url: `http://localhost:3000/redirection-vers-rendez-vous?result=success&session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: "http://localhost:3000/redirection-vers-rendez-vous?result=cancel",
            }); */