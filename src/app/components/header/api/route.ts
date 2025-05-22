import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  defaultSession,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import validator from "validator";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn !== true) {
    //session.destroy();
    return NextResponse.json(defaultSession);
  } else {
    const user = await prisma.user.findUnique({
      where: { id: validator.escape(session.id) },
    });
    if (user === null) {
      //session.destroy();
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
    const csrfToken = headers().get("x-csrf-token");

    if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
      return NextResponse.json(
        { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
        { status: 403 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: validator.escape(session.id) },
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
