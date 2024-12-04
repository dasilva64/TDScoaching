/* import { RateLimiter } from "limiter";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../../../lib/prisma";
import jwt from 'jsonwebtoken'
import validator from "validator";

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
        token
        .trim()
        .split(".")
        .map((t) => {
          t.split("").map((r) => {
            if (r === "<" || r === ">") {
              return NextResponse.json(
                {
                  status: 400,
                  message: "Le token n'est pas valide, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }
          });
        });
      let split = token.trim().split(".");
      if (
        split[0].length === 36 &&
        split[1].length > 0 &&
        split[2].length === 43 &&
        split.length === 3
      ){
        const { verify } = jwt;
        try {
          const decodeToken: any = verify(
            validator.escape(token.trim()),
            process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
          );
          const deleteMeet = await prisma.meetingDiscovery.delete({
            where: {userMail: decodeToken.user}
          })
          if (deleteMeet === null) {
            return NextResponse.json(
              {
                status: 400,
                message: "Le rendez-vous n'a pas été supprimé, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            return NextResponse.json(
              {
                status: 200,
                message: "Le rendez-vous a bien été supprimé",
              },
              {
                status: 200,
              }
            );
          }
        }catch (error) {
          return NextResponse.json(
            {
              status: 404,
              message:
                "Le lien n'est pas ou plus valide, veuillez réessayer",
            },
            {
              status: 404,
            }
          );
        }
          
        } else {
          return NextResponse.json(
            {
              status: 400,
              message: "La requête n'est pas valide, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
      }
      
    }
  } */