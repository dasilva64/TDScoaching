import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { Prisma } from "@prisma/client";
import validator from "validator";

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
        return NextResponse.json({
          status: 200,
          message: "Votre demande de modification d'email à été annulé",
          body: userObject,
        });
      }
    }
  }
}
