import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { Prisma } from "@prisma/client";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
    points: 5,
    duration: 60,
    keyPrefix: "rlflx-profile-email-cancel"
  });
  if (rateLimitResponse) return rateLimitResponse;
  const session = await getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
  const csrfTokenHeader = headers().get("x-csrf-token");
  const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
  if (csrfCheckResponse) return csrfCheckResponse;
  if (session.isLoggedIn !== true) {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      {
        status: 401,
      }
    );
  } else {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
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
      const updateUser: any = await prisma.user.update({
        where: { mail: user.mail },
        data: {
          editEmail: Prisma.DbNull,
        },
      });
      if (updateUser === null) {
        return NextResponse.json(
          {
            status: 400,
            message:
              "Une erreur est survenue lors de la modification de votre email, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        let userObject = {
          id: updateUser.id,
          role: updateUser.role,
          firstname: updateUser.firstname,
          lastname: updateUser.lastname,
          email: updateUser.mail,
          editEmail: updateUser.editEmail,
        };
        return NextResponse.json({
          status: 200,
          message: "Votre demande de modification d'email à été annulé",
          body: userObject,
        });
      }
    }
  }
  }catch (error) {
      handleError(error)
    }
  
}
