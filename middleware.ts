import { request } from "http";
import { SessionOptions, getIronSession } from "iron-session";
import { Bungee_Shade } from "next/font/google";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, sessionOptions as test } from "./lib/session";

interface SessionData {
  id: string;
  username: string;
  isLoggedIn: boolean;
  role: string;
}

/* const sessionOptions: Record<string, SessionOptions> = {
  "/profile": test,
}; */

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://tdscoaching.fr",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export const middleware = async (request: NextRequest) => {
  //const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  /* const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions[request.nextUrl.pathname]
  );

  if (!session.isLoggedIn) {
    const redirectTo = request.nextUrl.pathname.split("/profile")[0];

    return Response.redirect(`${request.nextUrl.origin}${redirectTo}`, 302);
  } */
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(request, res, {
    cookieName: "iron-examples-app-router-client-component-route-handler-swr",
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });

  //const { user } = session;

  if (
    request.nextUrl.pathname.startsWith("/components/forgot/api/:path*") ||
    request.nextUrl.pathname.startsWith("/components/header/api") ||
    request.nextUrl.pathname.startsWith("/components/login/api/:path*") ||
    request.nextUrl.pathname.startsWith("/components/register/api") ||
    request.nextUrl.pathname.startsWith("/contact/components/api") ||
    request.nextUrl.pathname.startsWith(
      "/email-validation/[token]/components/api"
    ) ||
    request.nextUrl.pathname.startsWith("/profile/components/api") ||
    request.nextUrl.pathname.startsWith(
      "/profile/components/deleteAccount/modal/api"
    ) ||
    request.nextUrl.pathname.startsWith("/profile/components/emailData/api") ||
    request.nextUrl.pathname.startsWith(
      "/profile/components/emailData/modal/api"
    ) ||
    request.nextUrl.pathname.startsWith(
      "/profile/components/emailSendTokenData/modal/api"
    ) ||
    request.nextUrl.pathname.startsWith(
      "/profile/components/firstnameData/modal/api"
    ) ||
    request.nextUrl.pathname.startsWith(
      "/profile/components/lastnameData/modal/api"
    ) ||
    request.nextUrl.pathname.startsWith(
      "/profile/components/passwordData/modal/api"
    ) ||
    request.nextUrl.pathname.startsWith(
      "/reinitialisation-mot-de-passe/[token]/components/api"
    ) ||
    request.nextUrl.pathname.startsWith(
      "/suppression-compte/[token]/components/api"
    ) ||
    request.nextUrl.pathname.startsWith("/utilisateur/[id]/components/api") ||
    request.nextUrl.pathname.startsWith("/utilisateurs/components/api")
  ) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.headers.append(key, value);
    });
    return res;
  } else {
    let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
    let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g;
    if (session.isLoggedIn || Object.keys(session).length !== 0) {
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
        regexTwo.test(request.nextUrl.pathname)
      ) {
        if (session.role !== "ROLE_USER") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }
    if (!session.isLoggedIn || Object.keys(session).length === 0) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (session.role !== "ROLE_USER" && session.role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return res;
  }
};

export const config = {
  matcher: [
    "/components/forgot/api/:path*",
    "/components/header/api",
    "/components/login/api/:path*",
    "/components/register/api",
    "/contact/components/api",
    "/email-validation/[token]/components/api",
    "/profile/components/api",
    "/profile/components/deleteAccount/modal/api",
    "/profile/components/emailData/api",
    "/profile/components/emailData/modal/api",
    "/profile/components/emailSendTokenData/modal/api",
    "/profile/components/firstnameData/modal/api",
    "/profile/components/lastnameData/modal/api",
    "/profile/components/passwordData/modal/api",
    "/reinitialisation-mot-de-passe/[token]/components/api",
    "/suppression-compte/[token]/components/api",
    "/utilisateur/[id]/components/api",
    "/utilisateurs/components/api",
    "/profile",
    "/utilisateurs",
    "/meetings",
    "/meetingAdmin",
    "/rendez-vous",
    "/utilisateur/:path*",
    "/suppression-compte",
  ],
};
