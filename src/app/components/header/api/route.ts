import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import { generateCsrfToken } from "../../functions/generateCsrfToken";
import { getRateLimiter } from "@/app/lib/rateLimiter";

export async function GET() {
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
}


export async function DELETE(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip;
  try {
    const rateLimiter = await getRateLimiter(5, 60, "rlflx-logout");
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
        { message: "Utilisateur introuvable", status: 400 },
        {
          status: 400,
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
}
