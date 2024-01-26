/* import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../../../../../../lib/session";
import prisma from "../../../../../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn !== true) {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      { status: 401 }
    );
  } else {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      return NextResponse.json(
        {
          status: 404,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        { status: 404 }
      );
    } else {
      let editUser = await prisma.user.update({
        where: { id: user.id },
        data: { twoFactor: false, twoFactorCode: Prisma.JsonNull },
      });
      if (editUser === null) {
        return NextResponse.json(
          {
            status: 400,
            message:
              "Une erreur est survenue lors de la désactivation de l'authentification à deux facteurs, veuillez réessayer",
          },
          { status: 400 }
        );
      } else {
        let userObject = {
          firstname: editUser.firstname,
          lastname: editUser.lastname,
          email: editUser.mail,
          twoFactor: editUser.twoFactor,
        };
        return NextResponse.json({
          status: 200,
          message:
            "Vous avez désactivé l'authentification à deux facteurs avec succès",
          body: userObject,
        });
      }
    }
  }
}
 */
