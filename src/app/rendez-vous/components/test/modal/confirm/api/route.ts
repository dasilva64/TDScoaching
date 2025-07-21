import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (session.isLoggedIn === true) {
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
        if (user.meetingId === null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous n'avez pas de rendez-vous à confirmer",
            },
            {
              status: 400,
            }
          );
        } else {
          try {
            await prisma.$transaction(async (tx) => {
              await prisma.meeting_test.update({
                where: { id: user.meetingId! },
                data: {
                  status: "confirmed"
                }
              });
            })
            return NextResponse.json(
              {
                status: 200,
                message: "Le rendez-vous a bien été confirmé",
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
                  "Une erreur est survenue lors de la confirmation le rendez-vous, veuillez réessayer",
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
  } catch (error: any) {
    handleError(error)
  }
}