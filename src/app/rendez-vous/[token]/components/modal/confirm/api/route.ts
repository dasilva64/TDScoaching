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
          meeting_test: true
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
      if (user.meeting_test?.status !== "not_confirmed") {
        return NextResponse.json(
          {
            status: 400,
            message: "Votre rendez-vous n'est pas a confirmé",
          },
          {
            status: 400,
          }
        );
      }
      const meeting = await prisma.meeting_test.update({
        where: { id: decodeToken.id },
        data: {
          status: "confirmed"
        },
      })
      if (meeting === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "Une erreur est survenue lors de la confirmation le rendez-vous, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        return NextResponse.json(
          {
            status: 200,
            body: { meeting },
            message: "Le rendez-vous a bien été confirmé",
          },
          {
            status: 200,
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