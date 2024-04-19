import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions } from "./lib/session";
import { cookies } from "next/headers";

interface SessionData {
  id: string;
  username: string;
  isLoggedIn: boolean;
  role: string;
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
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
    /* if (
      request.nextUrl.pathname.startsWith("/") ||
      request.nextUrl.pathname.startsWith("/coaching-de-vie") ||
      request.nextUrl.pathname.startsWith("/contact") ||
      request.nextUrl.pathname.startsWith(
        "/conditions-generales-utilisations"
      ) ||
      request.nextUrl.pathname.startsWith("/mentions-legales") ||
      request.nextUrl.pathname.startsWith("/politique-de-confidentialite") ||
      request.nextUrl.pathname.startsWith("/qui-suis-je") ||
      request.nextUrl.pathname.startsWith("/tarif") ||
      regexDelete.test(request.nextUrl.pathname) ||
      regexValid.test(request.nextUrl.pathname) ||
      regexReset.test(request.nextUrl.pathname)
    ) {
      return res;
    } */
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (session.role !== "ROLE_USER" && session.role !== "ROLE_ADMIN") {
    /* if (
      request.nextUrl.pathname.startsWith("/") ||
      request.nextUrl.pathname.startsWith("/coaching-de-vie") ||
      request.nextUrl.pathname.startsWith("/contact") ||
      request.nextUrl.pathname.startsWith(
        "/conditions-generales-utilisations"
      ) ||
      request.nextUrl.pathname.startsWith("/mentions-legales") ||
      request.nextUrl.pathname.startsWith("/politique-de-confidentialite") ||
      request.nextUrl.pathname.startsWith("/qui-suis-je") ||
      request.nextUrl.pathname.startsWith("/tarif") ||
      regexDelete.test(request.nextUrl.pathname) ||
      regexValid.test(request.nextUrl.pathname) ||
      regexReset.test(request.nextUrl.pathname)
    ) {
      return res;
    } */
    return NextResponse.redirect(new URL("/", request.url));
  }
  return res;

  //const { user } = session;

  /* if (
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
  } else { */
  /* let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
  let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g; */
  /* if (session.isLoggedIn || Object.keys(session).length !== 0) {
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
  } */

  //}
}

export const config = {
  matcher: [
    "/profile",
    "/utilisateurs",
    "/meetings",
    "/meetingAdmin",
    "/rendez-vous",
    "/utilisateur/:path*",
    "/suppression-compte/:path*",
  ],
};

/* "/components/forgot/api/:path*",
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
"/utilisateurs/components/api", */
