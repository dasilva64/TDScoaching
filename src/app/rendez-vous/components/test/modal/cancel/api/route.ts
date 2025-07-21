import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function DELETE(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
      points: 5,
      duration: 60,
      keyPrefix: "rlflx-meet-cancel"
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
        if (user.meetingId === null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous n'avez pas de rendez-vous de découverte à supprimer",
            },
            {
              status: 400,
            }
          );
        } else {
          let meeting = await prisma.meeting_test.findUnique({
            where: { id: user.meetingId },
          });
          if (meeting === null) {
            return NextResponse.json(
              {
                status: 400,
                message:
                  "Le rendez-vous n'as pas été trouvé, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            try {
              await prisma.$transaction(async (tx) => {
                await prisma.user.update({
                  where: { id: session.id },
                  data: {
                    meetingId: null,
                  },
                });
                await prisma.meeting_test.update({
                  where: { id: user.meetingId! },
                  data: { status: "cancelled" }
                });
                await prisma.offre_test.update({
                  where: {
                    id: user.offre_test?.id
                  },
                  data: {
                    currentNumberOfMeeting: null,
                    status: "cancelled"
                  }
                })
              })
              const stripe = new Stripe(
                "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f" as string, {
                apiVersion: '2022-11-15',
                typescript: true
              }
              );
              const sessiontest = await stripe.checkout.sessions.retrieve(user.offre_test?.sessionId!);
              if (sessiontest.status === "open") {
                await stripe.checkout.sessions.expire(
                  user.offre_test?.sessionId!
                );
              } else if (sessiontest.status === "complete") {
                const paymentIntentId = sessiontest.payment_intent;
                await stripe.paymentIntents.cancel(paymentIntentId as string);
              }
              return NextResponse.json(
                {
                  status: 200,
                  message: "Le rendez-vous a bien été annulé",
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
                    "Une erreur est survenue lors de l'annulation du rendez-vous, veuillez réessayer",
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
  } catch (error: any) {
    handleError(error)
  }
}