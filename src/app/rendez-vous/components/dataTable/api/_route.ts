/* import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../../lib/prisma";
import { SessionData, sessionOptions } from "../../../../../../lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn === true) {
    const user = await prisma.user.findUnique({
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
        let meeting = await prisma.meeting.findMany({
            where: { userId: user.id }
        })
      return NextResponse.json(
        {
          status: 200,
          message: "good",
          body: meeting,
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
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      {
        status: 401,
      }
    );
  }
}
 */