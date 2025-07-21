import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  SessionData,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimit } from "@/app/lib/rateLimiter";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimit(request, {
      points: 100,
      duration: 60,
      keyPrefix: "rlflx-profile-get"
    });
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (session.isLoggedIn === true) {
      const user = await prisma.user.findUnique({
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
        let copyEditEmail: any = user.editEmail;
        let userObject;
        if (copyEditEmail === null) {
          userObject = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.mail,
            newEmail: null,
            isTwoFactorEnabled: user.isTwoFactorEnabled

          };
        } else {
          userObject = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.mail,
            newEmail: copyEditEmail.newEmail,
            isTwoFactorEnabled: user.isTwoFactorEnabled
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
  } catch (error) {
    return handleError(error)
  }

}
