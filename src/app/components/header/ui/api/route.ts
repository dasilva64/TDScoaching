import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  
    if (session.isLoggedIn !== true) {
      
        return NextResponse.json({
            isLoggedIn: false,
          });
    } else {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        return NextResponse.json({
            isLoggedIn: false,
          });
      } else {
        return NextResponse.json({
            isLoggedIn: true,
            role: user.role,
            discovery: user.discovery,
            meeting: user.meetingId
          });
      }
    }
  }