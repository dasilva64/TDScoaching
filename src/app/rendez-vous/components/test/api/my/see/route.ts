import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-contract-refresh');
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
    if (session.isLoggedIn === true) {
      let user = await prisma.user.findUnique({
        where: { id: session.id },
        include: {
          offre_test: true
        }
      });
      if (user === null) {
        return NextResponse.json(
          {
            status: 401,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          },
          {
            status: 401,
          }
        );
      } else {
        try {
          
          const apiUrl = process.env.SUPABASE_STORAGE_URL_TEST as string;
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const response = await fetch(apiUrl + "-" + user.firstname + "-" + user.lastname + "-" + user.id + ".pdf", {
            method: "POST",
            headers: {
              apikey: serviceRoleKey,
              Authorization: `Bearer ${serviceRoleKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ expiresIn: 60 }), // Expiration en secondes
          });
          const { signedURL } = await response.json();
          const fullUrl = `${process.env.SUPABASE_BASE_URL_FETCH}${signedURL}`;
          
          return NextResponse.json(
            {
              status: 200,
              body: fullUrl,
            },
            {
              status: 200,
            }
          );
        } catch {
          return NextResponse.json(
            {
              status: 400,
              message: "Une erreur est survenue lors de la creation du contrat, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }

      }
    } else {
      return NextResponse.json(
        {
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez vous connecter",
        },
        {
          status: 401,
        }
      );
    }
  }
  catch (error: any) {
    return handleError(error)
  }
}