import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  defaultSession,
  sessionOptions,
} from "../../../../../lib/session";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn !== true) {
    return NextResponse.json(defaultSession, {
      headers: {
        "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
        Vary: "Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
      },
    });
  } else {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(defaultSession, {
        headers: {
          "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
          Vary: "Origin",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
      });
    } else {
      return NextResponse.json(session, {
        headers: {
          "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
          Vary: "Origin",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
      });
    }
  }
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (session.isLoggedIn !== true) {
    return NextResponse.json(
      { message: "Vous n'êtes pas connecté" },
      {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
          Vary: "Origin",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
      }
    );
  } else {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      return NextResponse.json(
        { message: "Utilisateur introuvable", status: 400 },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
            Vary: "Origin",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
          },
        }
      );
    } else {
      session.destroy();
      return NextResponse.json(
        {
          status: 200,
          message: "Vous êtes maintenant déconnecté",
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
            Vary: "Origin",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
          },
        }
      );
    }
  }
}
