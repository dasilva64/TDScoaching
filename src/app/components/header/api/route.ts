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
    return Response.json(defaultSession);
  } else {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      return Response.json(defaultSession);
    } else {
      return Response.json(session);
    }
  }
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (session.isLoggedIn !== true) {
    return Response.json(
      { message: "Vous n'êtes pas connecté" },
      { status: 401 }
    );
  } else {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      return Response.json(
        { message: "Utilisateur introuvable", status: 400 },
        { status: 400 }
      );
    } else {
      session.destroy();
      return Response.json({
        status: 200,
        message: "Vous êtes maintenant déconnecté",
      });
    }
  }
}
