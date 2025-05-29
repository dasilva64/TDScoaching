import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { SessionData, sessionOptions } from "./app/lib/session";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
  let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g;
  if (session.isLoggedIn) {
    if (
      request.nextUrl.pathname.startsWith("/utilisateurs") ||
      request.nextUrl.pathname.startsWith("/meetings") ||
      request.nextUrl.pathname.startsWith("/meetingAdmin") ||
      regex.test(request.nextUrl.pathname)
    ) {
      if (session.role !== "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (
      request.nextUrl.pathname.startsWith("/rendez-vous") ||
      regexTwo.test(request.nextUrl.pathname) ||
      request.nextUrl.pathname.startsWith('/historique-rendez-vous')
    ) {
      if (session.role !== "ROLE_USER") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }
  if (!session.isLoggedIn || Object.keys(session).length === 0) {
    session.destroy()
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (session.role !== "ROLE_USER" && session.role !== "ROLE_ADMIN") {
    session.destroy()
    return NextResponse.redirect(new URL("/", request.url));
  }
  return res;
}

export const config = {
  matcher: [
    "/profile",
    "/utilisateurs",
    "/utilisateur/:path*",
    "/suppression-compte/:path*",
    "/rendez-vous",
    "/meetings",
    "/historique-rendez-vous"
  ],
};
