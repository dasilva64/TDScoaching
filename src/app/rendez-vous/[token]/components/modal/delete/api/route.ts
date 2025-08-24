import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-meet-token-confirm');
  if (rateLimitResponse) return rateLimitResponse;
  const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
  const csrfTokenHeader = headers().get("x-csrf-token");
  const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
  if (csrfCheckResponse) return csrfCheckResponse;
  const { token } =
    (await request.json()) as {
      token: string;
    };
  if (token === null) {
    return NextResponse.json(
      {
        status: 400,
        message: "La requête n'est pas valide, veuillez réessayer",
      },
      {
        status: 400,
      }
    );
  } else {
    const { verify } = jwt;
    try {
      const decodeToken: any = verify(token.trim(),
        process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
      );
      const user = await prisma.user.findUnique({
        where: {
          mail: decodeToken.user
        },
        select: {
          meeting_test: true,
          offreId: true,
          id: true,
          password: true,
          meetingId: true
        }
      })
      if (user === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "L'utilisateur' n'a pas été trouvé, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      }
      let currentDate = new Date()
      if (new Date(user.meeting_test!.startAt).getTime() < currentDate.setHours(currentDate.getHours() + 5)) {
        return NextResponse.json(
          {
            status: 400,
            message: "Vous ne pouvez plus supprimer votre rendez-vous, veuillez nous contacter",
          },
          {
            status: 400,
          }
        );
      }
      try {
        if (!user.password) {
          await prisma.$transaction(async (tx) => {
            await prisma.meeting_test.delete({
              where: { id: user.meetingId! }
            })
            await prisma.offre_test.delete({
              where: { id: user.offreId! }
            })
            await prisma.userAgreement.delete({
              where: { userId: user.id }
            })
            await prisma.user.delete({
              where: { id: user.id }
            })
          })
          return NextResponse.json(
            {
              status: 200,
              message: "Le rendez-vous a bien été supprimé, vous pouvez reprendre un rendez-vous de découverte",
            },
            {
              status: 200,
            }
          );
        } else {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous ne pouvez pas supprimer votre rendez-vous, veuillez réessayer",
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
            message: "Une erreur est survenue lors de la suppression du rendez-vous, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      }
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json(
          { status: 400, message: "Le token a expiré, veuillez en générer un nouveau." },
          { status: 400 }
        );
      } else if (err.name === "JsonWebTokenError") {
        return NextResponse.json(
          { status: 400, message: "Le token est invalide." },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { status: 400, message: "Une erreur inconnue est survenue." },
          { status: 400 }
        );
      }
    }


  }

}
