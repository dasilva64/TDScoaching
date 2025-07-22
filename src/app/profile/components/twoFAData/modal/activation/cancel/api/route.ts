import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import { Prisma } from "@prisma/client";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
    const keyPrefix = "rlflx-profile-email-cancel";
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
    if (session.isLoggedIn !== true) {
      return NextResponse.json(
        {
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        },
        {
          status: 401,
        }
      );
    } else {
      let user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        return NextResponse.json(
          {
            status: 401,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          },
          {
            status: 401,
          }
        );
      } else {
        const updateUser: any = await prisma.user.update({
          where: { mail: user.mail },
          data: {
            twoFAToken: Prisma.DbNull,
          },
        });
        if (updateUser === null) {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Une erreur est survenue lors de la modification de la double authentification, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          let userObject = {
            id: updateUser.id,
            role: updateUser.role,
            firstname: updateUser.firstname,
            lastname: updateUser.lastname,
            email: updateUser.mail,
            editEmail: updateUser.editEmail,
          };
          return NextResponse.json({
            status: 200,
            message: "Votre demande de modification de double authentification à été annulé",
            body: userObject,
          });
        }
      }
    }
  } catch (error) {
    return handleError(error)
  }

}
