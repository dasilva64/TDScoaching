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
  let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
  let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g;
  if (
    request.nextUrl.pathname.startsWith("/utilisateurs") ||
    request.nextUrl.pathname.startsWith("/meetings") ||
    request.nextUrl.pathname.startsWith("/meetingAdmin") ||
    request.nextUrl.pathname.startsWith("/rendez-vous") ||
    request.nextUrl.pathname.startsWith("/utilisateur") ||
    regex.test(request.nextUrl.pathname) ||
    regexTwo.test(request.nextUrl.pathname)
  ) {
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
  } else {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
      .replace(/\s{2,}/g, " ")
      .trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);

    requestHeaders.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );
    return response;
  }
};

export const config = {
  matcher: [
    "/",
    "/qui-suis-je",
    "/coaching-de-vie",
    "/tarif",
    "/contact",
    "/profile",
    "/utilisateurs",
    "/meetings",
    "/meetingAdmin",
    "/rendez-vous",
    "/utilisateur/:path*",
    "/suppression-compte",
  ],
};
