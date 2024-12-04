import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  defaultSession,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import validator from "validator";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn === true) {
    const user = await prisma.user.findUnique({
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
      let copyEditEmail: any = user.editEmail;
      let userObject;
      if (copyEditEmail === null) {
        userObject = {
          firstname: validator.escape(user.firstname),
          lastname: validator.escape(user.lastname),
          email: validator.escape(user.mail),
          newEmail: "",
        };
      } else {
        userObject = {
          firstname: validator.escape(user.firstname),
          lastname: validator.escape(user.lastname),
          email: validator.escape(user.mail),
          newEmail: validator.escape(copyEditEmail.newEmail),
        };
      }
      return NextResponse.json({
        status: 200,
        body: userObject,
      });
    }
  } else {
    return NextResponse.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      {
        status: 401,
      }
    );
  }
}
