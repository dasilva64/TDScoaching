import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { CSRF_TOKEN_LIFETIME, NOW } from "@/app/components/constance/constance";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";

export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn) {
      session.csrfToken = generateCsrfToken();
      session.csrfTokenExpiry = NOW + CSRF_TOKEN_LIFETIME; // 1 minute
      await session.save();
  }
  return NextResponse.json({ ok: true });
}

