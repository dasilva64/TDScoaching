import { NextResponse } from "next/server";

export function csrfToken(csrfTokenFromHeader: string | null, sessionCsrfToken?: string) {
  if (!csrfTokenFromHeader || !sessionCsrfToken || csrfTokenFromHeader !== sessionCsrfToken) {
    return NextResponse.json(
      { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
      { status: 403 }
    );
  }
  return null;
}