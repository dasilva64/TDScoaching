import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(100, '60s'),
});

export async function GET(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
    const keyPrefix = "rlflx-profile-get";
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
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (session.isLoggedIn === true) {
      const user = await prisma.user.findUnique({
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
        let copyEditEmail: any = user.editEmail;
        let userObject;
        if (copyEditEmail === null) {
          userObject = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.mail,
            newEmail: null,
            isTwoFactorEnabled: user.isTwoFactorEnabled

          };
        } else {
          userObject = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.mail,
            newEmail: copyEditEmail.newEmail,
            isTwoFactorEnabled: user.isTwoFactorEnabled
          };
        }
        return NextResponse.json({
          status: 200,
          body: userObject,
        });
      }
    } else {
      return NextResponse.json(
        {
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        },
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    return handleError(error)
  }

}
