import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const csrfToken = generateCsrfToken()
  if (typeof session.isLoggedIn === "undefined") {
    session.csrfToken = csrfToken;
    session.updateConfig({
      ...sessionOptions,
      cookieOptions: {
        ...sessionOptions.cookieOptions,
        maxAge: 60 * 15,
      },
    });
    await session.save();
    return NextResponse.json({ csrfToken: csrfToken });
  } else {
    
    if (session.isLoggedIn) {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        session.destroy();  
        session.csrfToken = csrfToken;
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 15,
          },
        });    
      } else {
        session.csrfToken = csrfToken;
        session.updateConfig({
        ...sessionOptions,
        cookieOptions: {
          ...sessionOptions.cookieOptions,
          maxAge: undefined,
        },
      });
      }
      
    } else {
      session.csrfToken = csrfToken;
      session.updateConfig({
        ...sessionOptions,
        cookieOptions: {
          ...sessionOptions.cookieOptions,
          maxAge: 60 * 15,
        },
      });
    }
    await session.save();
    return NextResponse.json({ csrfToken: csrfToken });
  }
  
}

