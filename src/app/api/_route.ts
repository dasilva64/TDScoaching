import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import validator, { isDate } from "validator";
import bcrypt from "bcrypt";
import { RateLimiter } from "limiter";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { Stripe } from "stripe";

const limiter = new RateLimiter({
  tokensPerInterval: 600,
  interval: "hour",
  fireImmediately: true,
});

export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn === true) {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        meeting_test: true,
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
            message:
              "Vous n'avez pas de rendez-vous en cours, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        const stripe = new Stripe(
          "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f"
        );
        const session = await stripe.checkout.sessions.retrieve(
          request.nextUrl.searchParams.get("session_id")!
        );
        if (session) {
          const editMeeting = await prisma.meeting_test.update({
            where: {
              id: user.meetingId,
            },
            data: {
              confirm: true,
            },
          });
          return NextResponse.redirect(new URL("/rendez-vous", request.url));
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
