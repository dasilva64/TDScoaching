import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import Stripe from "stripe";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-meet-confirm-paid');
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
        if (user.offre_test!.type === "unique" && user.meetingId === null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous n'avez pas de rendez-vous en cours",
            },
            {
              status: 400,
            }
          );
        }
        if (user.offre_test!.type === "flash" && user.meetingId !== null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà un rendez-vous en cours",
            },
            {
              status: 400,
            }
          );
        }
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

          try {
            let setupIntent: any;
            const existingCustomers = await stripe.customers.list({
              email: user.mail,
              limit: 1,
            });

            let customer;
            if (existingCustomers.data.length > 0) {
              customer = existingCustomers.data[0];
            } else {
              customer = await stripe.customers.create({
                name: `${user.firstname} ${user.lastname}`,
                email: user.mail,
              });
            }
            setupIntent = await stripe.setupIntents.create({
              customer: customer.id,
              usage: 'off_session',
              description: "unique",
              payment_method_types: ['card'],
            });
            return NextResponse.json(
              {
                status: 200,
                //url: stripeSession.url,
                body: setupIntent.client_secret,
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