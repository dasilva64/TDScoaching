import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import prisma from "@/app/lib/prisma";
import { getRateLimiter } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
  
  export async function POST(request: NextRequest) {
    const ip: any = request.headers.get("x-forwarded-for") || request.ip;
  try {
    const rateLimiter = await getRateLimiter(15, 60, "rlflx-meet-token");
    await rateLimiter.consume(ip);
  } catch (err) {
    return NextResponse.json(
      {
        status: 429,
        message: "Trop de requêtes, veuillez réessayer plus tard",
      },
      { status: 429 }
    );
  }
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const csrfToken = headers().get("x-csrf-token");
  if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
    return NextResponse.json(
      { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
      { status: 403 }
    );
  }
  if (session.isLoggedIn) {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'avez pas accès à cette route, veuillez réessayer"

      },
      {
        status: 401
      }
    )
  }
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
            const csrfToken = generateCsrfToken()
          session.csrfToken = csrfToken;
            session.updateConfig({
              ...sessionOptions,
              cookieOptions: {
                ...sessionOptions.cookieOptions,
                maxAge: 60 * 15,
              },
            });
          
          await session.save();
            return NextResponse.json(
              {
                status: 200,
                csrfToken: csrfToken,
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
  