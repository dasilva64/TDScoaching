import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { Prisma } from "@prisma/client";
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
      where: { id: session.id },
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
}
