import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";
import { validationBody } from "@/app/lib/validation";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { csrfToken } from "@/app/lib/csrfToken";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-meet-token-edit');
  if (rateLimitResponse) return rateLimitResponse;
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
          if (arrayMessageError.length === 1) {
            if (arrayMessageError[0][0] === "unknown_fields") {
              return NextResponse.json(
                {
                  status: 400,
                  message: arrayMessageError[0][1],
                },
                {
                  status: 400,
                }
              );
            }
          }
          return NextResponse.json(
            {
              status: 400,
              type: "validation",
              message: arrayMessageError,
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
          let currentDate = new Date()
              if (date.getTime() < currentDate.setHours(currentDate.getHours() + 36)) {
                return NextResponse.json(
                  {
                    status: 400,
                    message: "Veuillez sélectionner une date située au-delà des prochaines 36 heures",
                  },
                  {
                    status: 400,
                  }
                );
              }
          try {
            const user = await prisma.user.findUnique({
              where: {
                mail: decodeToken.user
              },
              select: {
                meeting_test: true,
                meetingId: true,
                offreId: true
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
            if (new Date(user.meeting_test!.startAt).getTime() < currentDate.setHours(currentDate.getHours() + 5)) {
                return NextResponse.json(
                  {
                    status: 400,
                    message: "Vous ne pouvez plus modifier votre rendez-vous, veuillez nous contacter",
                  },
                  {
                    status: 400,
                  }
                );
              }
            const {meeting, offre} = await prisma.$transaction(async (tx) => {
              let meeting = await prisma.meeting_test.update({
                where: { id: user.meetingId! },
                data: {
                  startAt: start,
                },
              });
              let offre = await prisma.offre_test.update({
                where: { id: user.offreId! },
                data: {
                  coaching: typeCoaching
                }
              })
              return {meeting, offre}
            })
            return NextResponse.json(
              {
                status: 200,
                body: {
                  meeting,
                  offre
                },
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

