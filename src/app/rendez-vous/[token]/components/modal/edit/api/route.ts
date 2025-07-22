import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";
import { validationBody } from "@/app/lib/validation";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { csrfToken } from "@/app/lib/csrfToken";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? 'ip';
  const keyPrefix = "rlflx-meet-token-edit";
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
  const { token, start, typeCoaching } = (await request.json()) as {
    start: any;
    token: string;
    typeCoaching: string;
  };
  let arrayMessageError = validationBody({
    start: start,
    typeCoaching: typeCoaching,
  });
  if (arrayMessageError.length > 0) {
    return NextResponse.json(
      {
        status: 400,
        type: "validation",
        message: "Une erreur est survenue lors de la modification du rendez-vous, veuillez réessayer",
      },
      {
        status: 400,
      }
    );
  } else {
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
        let date = new Date(start);
        if (date < new Date()) {
          return NextResponse.json(
            {
              status: 400,
              message: "La date ne peut pas être dans le passé",
            },
            {
              status: 400,
            }
          );
        } else {
          try {
            const user = await prisma.user.findUnique({
              where: {
                mail: decodeToken.user
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
            await prisma.$transaction(async (tx) => {
              await prisma.meeting_test.update({
                where: { id: user.meetingId! },
                data: {
                  startAt: start,
                },
              });
              await prisma.offre_test.update({
                where: { id: user.offreId! },
                data: {
                  coaching: typeCoaching
                }
              })
            })
            return NextResponse.json(
              {
                status: 200,
                message: "Le rendez-vous a bien été modifié",
              },
              {
                status: 200,
              }
            );
          } catch {
            return NextResponse.json(
              {
                status: 400,
                message: "Une erreur est survenue lors de la modification du rendez-vous, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          }

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

}

