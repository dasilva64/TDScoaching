import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimit } from "@/app/lib/rateLimiter";

export async function GET(request: NextRequest) {
  try {
   /*  const rateLimitResponse = await checkRateLimit(request, {
      points: 100,
      duration: 60,
      keyPrefix: "rlflx-historique-rdv-get"
    });
    if (rateLimitResponse) return rateLimitResponse; */
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (session.isLoggedIn !== true) {
      return NextResponse.json(
        {
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        },
        {
          status: 401,
        }
      );
    } else {
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
        const allOffresWithMeetings = await prisma.offre_test.findMany({
          where: { userId: user.id },
          include: {
            meeting_test_meeting_test_offreIdTooffre_test: {
              select: {
                id: true,
                status: true,
                startAt: true,
                numberOfMeeting: true
              },
            },
          }
        });
        const lastMeetingPromises = allOffresWithMeetings.map((offre) => {
          if (offre.currentMeetingId === null) return Promise.resolve(null);
          return prisma.meeting_test.findUnique({ where: { id: offre.currentMeetingId } });
        });

        const lastMeetings = await Promise.all(lastMeetingPromises);

        const objet = allOffresWithMeetings.map((offre, index) => {
          const LastMeeting = lastMeetings[index];
          const updatedArray = offre.meeting_test_meeting_test_offreIdTooffre_test
            .filter(obj => obj.status !== "cancelled")
            .sort((a: any, b: any) => a.numberOfMeeting - b.numberOfMeeting);
          return {
            "Type de l'offre": offre.type === "discovery" ? "Découverte" : offre.type[0].toUpperCase() + offre.type.slice(1),
            "Type de coaching": offre.coaching ? offre.coaching[0].toUpperCase() + offre.coaching.slice(1) : "Pas encore de coaching",
            "Statut du paiement": offre.type === "discovery" ? "Gratuit" : offre.payment ? "Payé" : "Non payé",
            "Dernier rendez-vous": LastMeeting
              ? `${new Date(LastMeeting.startAt).toLocaleString("fr")} (${offre.currentNumberOfMeeting}/${["discovery", "unique"].includes(offre.type) ? "1" : "3"})`
              : "Pas encore de rendez-vous",
            meetings: updatedArray
          };
        });
        return NextResponse.json({
          status: 200,
          body: objet,
        });

      }
    }
  } catch (error: any) {
    return handleError(error)
  }

}
