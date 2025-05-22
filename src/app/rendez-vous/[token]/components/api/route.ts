import { Prisma } from "@prisma/client";
import { RateLimiter } from "limiter";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import jwt from 'jsonwebtoken'
import prisma from "@/app/lib/prisma";

const limiter = new RateLimiter({
    tokensPerInterval: 1000,
    interval: 5000,
    fireImmediately: true,
  });
  
  export async function POST(request: NextRequest) {
    const remainingRequests = await limiter.removeTokens(1);
    if (remainingRequests < 0) {
      return NextResponse.json(
        {
          status: 429,
          type: "error",
          message: "Trop de requêtes successives, veuillez réessayer plus tard",
        },
        {
          status: 429,
        }
      );
    } else {
      const { token } =
      (await request.json()) as {
        token: string;
      };

      if (token === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "Le token n'est pas valide, veuillez réessayer",
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
          const meet = await prisma.meeting_test.findUnique({
            where: {
              id: decodeToken.id
            },
            select: {
              startAt: true,
              type: true,
              confirm: true,
              userMail: true,
              coaching: true
            }
          })
          if (meet === null) {
            return NextResponse.json(
              {
                status: 400,
                message: "Le rendez-vous n'a pas été trouvé, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            const allMeeting = await prisma.meeting_test.findMany({
              where: { startAt: { gte: new Date() } },
              select: {
                startAt: true,
                userMail: true,
              },
            })
            return NextResponse.json(
              {
                status: 200,
                message: "Le rendez-vous a été trouvé",
                body: {meet: meet, allMeeting: allMeeting},
              },
              {
                status: 200,
              }
            );
          }

        }  catch (err: any) {
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
      
    }}
  }