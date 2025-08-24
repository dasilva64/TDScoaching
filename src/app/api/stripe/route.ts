import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { Stripe } from "stripe";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";


export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-api-stripe');
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
          offre_test: true
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
        if (user.offreId === null) {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Vous n'avez pas d'offre en cours, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        if (user.offre_test!.type === "unique" && user.meetingId === null) {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Vous n'avez pas de rendez-vous en cours, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }if (user.offre_test!.type === "flash" && user.meetingId !== null) {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Vous avez deja un rendez-vous en cours, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
          try {
            const stripe = new Stripe(
              "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f" as string, {
              apiVersion: '2022-11-15',
              typescript: true
            })
            const session = await stripe.checkout.sessions.retrieve(
              request.nextUrl.searchParams.get("session_id")!
            );
            if (session) {
              await prisma.$transaction(async (tx) => {
               /*  await prisma.meeting_test.update({
                  where: {
                    id: user?.meetingId!,
                  },
                  data: {
                    status: "confirmed",
                  },
                }); */
                /* await prisma.offre_test.update({
                  where: {
                    id: user?.offreId!
                  },
                  data: {
                    status: "confirmed",
                    payment: true
                  }
                }) */
              });
              return NextResponse.json(
                {
                  status: 200,
                  message: "Votre paiement a été effectué avec succès",
                },
                {
                  status: 200,
                }
              );
            } else {
              return NextResponse.json(
                {
                  status: 400,
                  message: "Aucun paiement n'a été trouvé, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }
          } catch (error) {
            return NextResponse.json(
              {
                status: 400,
                message: "Une erreur est survenue lors du paiement, veuillez réessayer",
              },
              {
                status: 400,
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
