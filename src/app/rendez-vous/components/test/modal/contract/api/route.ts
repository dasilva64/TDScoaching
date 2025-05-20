import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  
    if (session.isLoggedIn === true) {
      let user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        session.destroy();
        return NextResponse.json(
          {
            status: 400,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        let copyEditEmail: any = user.editEmail;
          let userObject;
          if (copyEditEmail === null) {
            userObject = {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.mail,
              newEmail: "",
            };
          } else {
            userObject = {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.mail,
              newEmail: copyEditEmail.newEmail,
            };
          }
          return NextResponse.json(
            {
              status: 200,
              body: userObject,
            },
            {
              status: 200,
            }
          );
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