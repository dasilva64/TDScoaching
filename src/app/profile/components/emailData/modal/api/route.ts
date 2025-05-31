import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { Prisma } from "@prisma/client";
import validator from "validator";
import { generateCsrfToken } from "@/app/components/functions/generateCsrfToken";
import { getRateLimiter } from "@/app/lib/rateLimiter";

export async function POST(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip; // Récupérer l’IP
  try {
    const rateLimiter = await getRateLimiter(5, 60, "rlflx-profile-email-cancel");
    await rateLimiter.consume(ip);
  } catch (err) {
    return NextResponse.json(
      {
        status: 429,
        message: "Trop de requêtes, veuillez réessayer plus tard",
      },
      { status: 429 }
    );
  }
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const csrfToken = headers().get("x-csrf-token");

  if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
    return NextResponse.json(
      { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
      { status: 403 }
    );
  }
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
      where: { id: validator.escape(session.id) },
    });
    if (user === null) {
      session.destroy();
      return NextResponse.json(
        {
          status: 404,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        {
          status: 404,
        }
      );
    } else {
      const updateUser: any = await prisma.user.update({
        where: { mail: validator.escape(user.mail) },
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
          id: validator.escape(updateUser.id),
          role: validator.escape(updateUser.role),
          firstname: validator.escape(updateUser.firstname),
          lastname: validator.escape(updateUser.lastname),
          email: validator.escape(updateUser.mail),
          editEmail: updateUser.editEmail,
        };
        const csrfToken = generateCsrfToken()
          session.csrfToken = csrfToken;
          if (session.rememberMe) {
            session.updateConfig({
              ...sessionOptions,
              cookieOptions: {
                ...sessionOptions.cookieOptions,
                maxAge: 60 * 60 * 24 * 30,
              },
            });
          } else {
            session.updateConfig({
              ...sessionOptions,
              cookieOptions: {
                ...sessionOptions.cookieOptions,
                maxAge: undefined,
              },
            });
          }
          await session.save();
        return NextResponse.json({
          status: 200,
          message: "Votre demande de modification d'email à été annulé",
          body: userObject,
        });
      }
    }
  }
}
