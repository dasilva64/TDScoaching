import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { SessionData, sessionOptions } from "./app/lib/session";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  //const res = NextResponse.next();

   /* const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://maps.googleapis.com https://maps.gstatic.com;
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com;
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()
 
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
 
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
 */
  const res = NextResponse.next( /* {
    request: {
      headers: requestHeaders,
    },
  } */ )
  /*  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue 
  )  */
  let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
  let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g;
  if (request.nextUrl.pathname.startsWith("/utilisateurs") ||
    request.nextUrl.pathname.startsWith("/meetings") ||
    request.nextUrl.pathname.startsWith("/meetingAdmin") ||
    regex.test(request.nextUrl.pathname) ||
    request.nextUrl.pathname === "/acces-refuse" ||
    request.nextUrl.pathname === "/rendez-vous" ||
    regexTwo.test(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/redirection-vers-rendez-vous") ||
    request.nextUrl.pathname.startsWith('/historique-rendez-vous')) {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    if (request.nextUrl.pathname.startsWith('/acces-refuse')) {
      if (session.isLoggedIn) {
        return NextResponse.redirect(new URL(`/`, request.url));
      }
      return res
    }
    if (session.isLoggedIn) {
      if (request.nextUrl.pathname.startsWith('/acces-refuse')) {
        return NextResponse.redirect(new URL(`/`, request.url));
      }
      if (
        request.nextUrl.pathname.startsWith("/utilisateurs") ||
        request.nextUrl.pathname.startsWith("/meetings") ||
        request.nextUrl.pathname.startsWith("/meetingAdmin") ||
        regex.test(request.nextUrl.pathname)
      ) {
        if (session.role !== "ROLE_ADMIN") {
          return NextResponse.redirect(new URL(`/acces-refuse?destination=${request.nextUrl.pathname.substring(1, request.nextUrl.pathname.length)}`, request.url));
        }
      }

      if (
        request.nextUrl.pathname.startsWith("/rendez-vous") ||
        regexTwo.test(request.nextUrl.pathname) ||
        request.nextUrl.pathname.startsWith("/redirection-vers-rendez-vous") ||
        request.nextUrl.pathname.startsWith('/historique-rendez-vous')
      ) {
        if (session.role !== "ROLE_USER") {
          return NextResponse.redirect(new URL(`/acces-refuse?destination=${request.nextUrl.pathname.substring(1, request.nextUrl.pathname.length)}`, request.url));
        }
      }
    }
    if (!session.isLoggedIn || Object.keys(session).length === 0) {

      return NextResponse.redirect(new URL(`/acces-refuse?destination=${request.nextUrl.pathname.substring(1, request.nextUrl.pathname.length)}`, request.url));
    }
    if (session.role !== "ROLE_USER" && session.role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL(`/acces-refuse?destination=${request.nextUrl.pathname.substring(1, request.nextUrl.pathname.length)}`, request.url));
    }
    return res;
  }
  return res;

}

/* export const config = {
  matcher: [
    "/profile",
    "/utilisateurs",
    "/utilisateur/:path*",
    "/suppression-compte/:path*",
    "/rendez-vous",
    "/meetings",
    "/historique-rendez-vous"
  ],
}; */

export const config = {
  matcher: [

    /*  * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file) */

    {
      source: '/((?!api|assets|components|_next/static|_next/image|favicon.ico|\\.well-known).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
