import { RateLimiter } from "limiter";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import validator from "validator";
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
          const editMeet = await prisma.meeting_test.update({
            where: {id: decodeToken.id},
            data: {
                confirm: true,
              },
          })
          if (editMeet === null) {
            return NextResponse.json(
              {
                status: 400,
                message: "Le rendez-vous n'a pas été modifié, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            return NextResponse.json(
              {
                status: 200,
                message: "Le rendez-vous a bien été confirmé",
              },
              {
                status: 200,
              }
            );
          }
        }catch (err: any) {
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