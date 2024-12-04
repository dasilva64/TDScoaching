import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
    for(let i = 0; i<10; i++) {
      /* const article = await prisma.article.create({
        data: {
          title: 'test' + i,
          slug: 'test' + i,
          description: 'description' + i,
          created_at: new Date(),
          content: {"d": "d"},
          image: "meditate.jpg"
        }
      }) */
      /* const user = await prisma.user.create({
      data: {
        firstname: 'test' + i,
        lastname: 'test' + i,
        mail: i + 'test@gmail.com',
        password: '$2b$10$t216ouJ5loXBz1nAMnfHhOZxyJHPekrE5QfMLfJFULMFMWL/sEvHm',
        role: 'ROLE_USER',
        status: true,
        discovery: false,
        typeMeeting: {"type": "découverte",
  "coaching": "couple"}
      }
    }) */
    }
    
    return NextResponse.json(defaultSession);
  } else {
    const user = await prisma.user.findUnique({
      where: { id: validator.escape(session.id) },
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
