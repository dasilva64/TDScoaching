/* import { getIronSession } from "iron-session/edge";
import { Bungee_Shade } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, {
    cookieName: "test",
    password:
      "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
  const { user } = session;

  let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
  let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g;
  if (user) {
    if (
      req.nextUrl.pathname.startsWith("/utilisateurs") ||
      req.nextUrl.pathname.startsWith("/meetings") ||
      req.nextUrl.pathname.startsWith("/meetingAdmin") ||
      regex.test(req.nextUrl.pathname)
    ) {
      if (user.role !== "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    if (
      req.nextUrl.pathname.startsWith("/rendez-vous") ||
      regexTwo.test(req.nextUrl.pathname)
    ) {
      if (user.role !== "ROLE_USER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }
  if (!user) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (user.role !== "ROLE_USER" && user.role !== "ROLE_ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return res;
};

export const config = {
  matcher: [
    "/profile",
    "/utilisateurs",
    "/historique",
    "/meetings",
    "/rendez-vous",
    "/meetingAdmin",
    "/utilisateur/:path*",
    "/suppression-compte/:path*",
  ],
};
 */
