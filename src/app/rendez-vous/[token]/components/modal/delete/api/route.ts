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
    const rateLimiter = await getRateLimiter(5, 60, "rlflx-meet-token-confirm");
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
          const editUser = await prisma.user.update({
            where: {mail: decodeToken.user},
            data: {meetingId: null}
          })
          const deleteMeet = await prisma.meeting_test.delete({
            where: {id: decodeToken.id}
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
            const deleteUser = await prisma.user.delete({
              where: {id: editUser.id}
            })
            /* const csrfToken = generateCsrfToken()
            session.csrfToken = csrfToken;
            session.updateConfig({
              ...sessionOptions,
              cookieOptions: {
                ...sessionOptions.cookieOptions,
                maxAge: 60 * 15,
              },
            });
          
          await session.save(); */
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
  