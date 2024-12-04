/* import { RateLimiter } from "limiter";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import jwt from 'jsonwebtoken'
import prisma from "../../../../../../../../lib/prisma";
import { JsonWebTokenError } from "jsonwebtoken";

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
      const { token, start } =
      (await request.json()) as {
        start: any
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
      ) {
        const { verify } = jwt;
        try {
          const decodeToken: any = verify(
            validator.escape(token.trim()),
            process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
          );
          const editMeet = await prisma.meetingDiscovery.update({
            where: {userMail: decodeToken.user},
            data: {
                startAt: start,
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
                message: "Le rendez-vous a bien été modifié",
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