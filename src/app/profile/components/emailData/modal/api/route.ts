import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../../../lib/session";
import { Prisma } from "@prisma/client";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn !== true) {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
          Vary: "Origin",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
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
          headers: {
            "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
            Vary: "Origin",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
          },
        }
      );
    } else {
      const updateUser = await prisma.user.update({
        where: { mail: user.mail },
        data: {
          editEmail: Prisma.JsonNull,
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
            headers: {
              "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
              Vary: "Origin",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Accept",
            },
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
        return NextResponse.json(
          {
            status: 200,
            message: "Votre demande de modification d'email à été annulé",
            body: userObject,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "https://www.tdscoaching.fr",
              Vary: "Origin",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Accept",
            },
          }
        );
      }
    }
  }
}
