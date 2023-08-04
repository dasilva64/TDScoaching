import { getIronSession } from "iron-session/edge";
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
  if (user) {
    if (
      req.nextUrl.pathname.startsWith("/utilisateurs") ||
      req.nextUrl.pathname.startsWith("/meetings") ||
      req.nextUrl.pathname.startsWith("/meetingAdmin")
    ) {
      if (user.role !== "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    if (req.nextUrl.pathname.startsWith("/rendez-vous")) {
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
    "/meetings",
    "/rendez-vous",
    "/meetingAdmin",
  ],
};
