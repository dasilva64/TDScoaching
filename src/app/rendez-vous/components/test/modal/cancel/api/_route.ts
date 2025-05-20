/* import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function DELETE(request: NextRequest) {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  
    if (session.isLoggedIn === true) {
      let user = await prisma.user.findUnique({
        where: { id: session.id },
        include: {
          offre_test: true
        }
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
            let id = user.meetingId
            await prisma.user.update({
              where: { id: session.id },
              data: {
                meetingId: null,
              },
            });
            await prisma.meeting_test.delete({
              where: { id: id },
            });
            
            const stripe = new Stripe(
              "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f"
            );
            const stripeSession = await stripe.checkout.sessions.expire(
              user.offre_test?.sessionId!
            );
            await prisma.offre_test.update({
              where: {
                id: user.offre_test?.id
              },
              data: {
                sessionId: null
              }
            })
            return NextResponse.json(
              {
                status: 200,
                message: "Le rendez-vous a bien été annulé",
              },
              {
                status: 200,
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
  } */