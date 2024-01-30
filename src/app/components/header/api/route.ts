import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  defaultSession,
  sessionOptions,
} from "../../../../../lib/session";
import prisma from "../../../../../lib/prisma";

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  console.log(origin);
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  let objectSession = {
    session: session,
    origin: origin,
  };
  return NextResponse.json(objectSession);
  if (session.isLoggedIn !== true) {
    return NextResponse.json(defaultSession);
  } else {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(defaultSession);
    } else {
      return NextResponse.json(session);
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
