import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const csrfToken = generateCsrfToken()
  session.csrfToken = csrfToken;
  if (session.isLoggedIn) {
    session.updateConfig({
      ...sessionOptions,
      cookieOptions: {
        ...sessionOptions.cookieOptions,
        maxAge: undefined,
      },
    });
  } else {
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

