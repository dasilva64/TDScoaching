import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import { generateCsrfToken } from "../../functions/generateCsrfToken";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, '60s'),
});

export async function GET(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        status: 429,
        message: "Trop de requêtes, veuillez réessayer plus tard",
      },
      { status: 429 }
    );
  }
   /*  const rateLimitResponse = await checkRateLimit(request, {
      points: 10000,
      duration: 60,
      keyPrefix: "rlflx-header"
    });
    if (rateLimitResponse) return rateLimitResponse; */
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.csrfToken = generateCsrfToken();
    const is2FAExpired =
      session.expireTwoFa && new Date() > new Date(session.expireTwoFa);
    if (session.isLoggedIn === true) {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      });

      if (!user) {
        session.destroy();
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 15,
          },
        });
        await session.save();
        return NextResponse.json(session);
      }
      if (session.rememberMe) {
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 60 * 24 * 30,
          },
        });
      }
      await session.save();
      return NextResponse.json(session);
    }
    if (session.id) {
      if (is2FAExpired) {
        session.destroy();
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 15,
          },
        });
        await session.save();
        return NextResponse.json(session);
      }
      if (session.rememberMe) {
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 60 * 24 * 30,
          },
        });
      }
      await session.save();
      return NextResponse.json(session);
    }
    session.updateConfig({
      ...sessionOptions,
      cookieOptions: {
        ...sessionOptions.cookieOptions,
        maxAge: 60 * 15,
      },
    });
    await session.save();
    return NextResponse.json(session);
  } catch (error) {
    return handleError(error)
  }

}


export async function DELETE(request: NextRequest) {
  try {
   /*  const rateLimitResponse = await checkRateLimit(request, {
      points: 5,
      duration: 60,
      keyPrefix: "rlflx-logout"
    });
    if (rateLimitResponse) return rateLimitResponse; */
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
    if (session.isLoggedIn !== true) {
      return NextResponse.json(
        { message: "Vous n'êtes pas connecté" },
        {
          status: 401,
        }
      );
    } else {
      const csrfToken = headers().get("x-csrf-token");
      if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
        return NextResponse.json(
          { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
          { status: 403 }
        );
      }
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        return NextResponse.json(
          { message: "Utilisateur introuvable", status: 401 },
          {
            status: 401,
          }
        );
      } else {
        session.destroy();
        return NextResponse.json({
          status: 200,
          message: "Vous êtes maintenant déconnecté",
        });
      }
    }
  } catch (error: any) {
    return handleError(error)
  }

}
