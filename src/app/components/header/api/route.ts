import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import { ipAddress } from '@vercel/functions'
import {
  SessionData,
  sessionOptions,
} from "../../../lib/session";
import prisma from "../../../lib/prisma";
import { generateCsrfToken } from "../../functions/generateCsrfToken";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import { checkRateLimitLong, checkRateLimitShort } from "@/app/lib/rateLimiter";
import { Resend } from 'resend';
import { Prisma } from "@prisma/client";

//export const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  /* try {
    const data = await resend.emails.send({
      from: 'contact@tds-coachingdevie.fr',
      to: 'thomasdasilva010@gmail.com', // Change selon le test : bounced@resend.dev, etc.
      subject: 'Test Resend Email',
      html: '<p>Ceci est un test depuis Next.js 🚀</p>',
    });

    return NextResponse.json(
      {
        message: "good email",
        session: {
              csrfToken: "",
              isLoggedIn: false,
              role: "",
            },
        status: 200
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "wrong email",
        session: {
              csrfToken: "",
              isLoggedIn: false,
              role: "",
            },
        status: 400
      },
      { status: 400 }
    );
  } */
  try {
    const rateLimitResponse = await checkRateLimitLong(request, 'rlflx-header');
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipFromHeader = forwardedFor?.split(',')[0]?.trim();
    const currentIp = ipFromHeader || (request as any).ip || ipAddress(request) || 'unknown';
    const currentUA = request.headers.get('user-agent') || '';


    session.csrfToken = generateCsrfToken();
    if (session.ip && session.userAgent) {
      if (session.ip !== currentIp || session.userAgent !== currentUA) {
        session.id = "";
        session.isLoggedIn = false;
        session.role = "";
        session.ip = "";
        session.userAgent = "";
        session.rememberMe = false;
        session.expireTwoFa = null;
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: { ...sessionOptions.cookieOptions, maxAge: 60 * 15 },
        });
        await session.save();
        return NextResponse.json(
          {
            message: "Session invalide : IP ou User-Agent modifié",
            session: {
              csrfToken: session.csrfToken,
              isLoggedIn: session.isLoggedIn,
              role: session.role,
            },
            status: 401
          },
          { status: 200 }
        );
      }
    } else {
      session.ip = currentIp;
      session.userAgent = currentUA;
    }
    const is2FAExpired = session.expireTwoFa && new Date() > new Date(session.expireTwoFa);

    if (session.isLoggedIn === true) {
      
const user = await prisma.user.findUnique({ where: { id: session.id }, include: {
        meeting_test: true,
        offre_test: true
      } });
      if (!user) {
        session.id = "";
        session.isLoggedIn = false;
        session.role = "";
        session.rememberMe = false;
        session.expireTwoFa = null;
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: { ...sessionOptions.cookieOptions, maxAge: 60 * 15 },
        });
        await session.save();
        return NextResponse.json(
          {
            message: "Session invalide : utilisateur introuvable",
            session: {
              csrfToken: session.csrfToken,
              isLoggedIn: session.isLoggedIn,
              role: session.role,
            },
            status: 401
          },
          { status: 200 }
        );
      }

      if (session.rememberMe) {
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: { ...sessionOptions.cookieOptions, maxAge: 60 * 60 * 24 * 30 },
        });
      }

      await session.save();
      return NextResponse.json(
        {
          session: {
            csrfToken: session.csrfToken,
            isLoggedIn: session.isLoggedIn,
            role: session.role,
          },
          body: {
            meeting: user!.meeting_test?.status,
            offre: user?.offre_test?.hasCard,
            discovery: user.discovery,
            typeOffre: user.offre_test?.type,
            hasMeeting: user.meetingId
          },
          status: 200
        },
        { status: 200 }
      );
    }

    if (session.id) {
      if (is2FAExpired) {
        session.id = "";
        session.isLoggedIn = false;
        session.role = "";
        session.rememberMe = false;
        session.expireTwoFa = null;
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: { ...sessionOptions.cookieOptions, maxAge: 60 * 15 },
        });
        await session.save();
        return NextResponse.json(
          {
            message: "Session invalide : double authentification expirée",
            session: {
              csrfToken: session.csrfToken,
              isLoggedIn: session.isLoggedIn,
              role: session.role,
            },
            status: 401
          },
          { status: 200 }
        );
      }

      if (session.rememberMe) {
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: { ...sessionOptions.cookieOptions, maxAge: 60 * 60 * 24 * 30 },
        });
      }
      await session.save();
      return NextResponse.json(
        {
          session: {
            csrfToken: session.csrfToken,
            isLoggedIn: session.isLoggedIn,
            role: session.role,
          },
          status: 200
        },
        { status: 200 }
      );
    }

    session.updateConfig({
      ...sessionOptions,
      cookieOptions: { ...sessionOptions.cookieOptions, maxAge: 60 * 15 },
    });
    await session.save();
    return NextResponse.json(
      {
        session: {
          csrfToken: session.csrfToken,
          isLoggedIn: session.isLoggedIn,
          role: session.role,
        },
        status: 200
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        default:
          return NextResponse.json({
            status: 500,
            message: `Erreur technique Prisma (code : ${error.code}).`,
          }, { status: 500 });
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({
        status: 500,
        message: "Erreur de validation : les données ne respectent pas le schéma attendu.",
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 500,
      message: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
    }, { status: 500 });
  }
}

/* export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitLong(request, 'rlflx-header');
    if (rateLimitResponse) return rateLimitResponse;
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.csrfToken = generateCsrfToken();
    const is2FAExpired =
      session.expireTwoFa && new Date() > new Date(session.expireTwoFa);
    if (session.isLoggedIn === true) {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      });

      if (!user) {
        session.destroy();
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 15,
          },
        });
        await session.save();
        return NextResponse.json(session);
      }
      if (session.rememberMe) {
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 60 * 24 * 30,
          },
        });
      }
      await session.save();
      return NextResponse.json(session);
    }
    if (session.id) {
      if (is2FAExpired) {
        session.destroy();
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 15,
          },
        });
        await session.save();
        return NextResponse.json(session);
      }
      if (session.rememberMe) {
        session.updateConfig({
          ...sessionOptions,
          cookieOptions: {
            ...sessionOptions.cookieOptions,
            maxAge: 60 * 60 * 24 * 30,
          },
        });
      }
      await session.save();
      return NextResponse.json(session);
    }
    session.updateConfig({
      ...sessionOptions,
      cookieOptions: {
        ...sessionOptions.cookieOptions,
        maxAge: 60 * 15,
      },
    });
    await session.save();
    return NextResponse.json(session);
  } catch (error) {
    return handleError(error)
  }

} */


export async function DELETE(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-header-logout');
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
        { message: "Vous n'êtes pas connecté" },
        {
          status: 401,
        }
      );
    } else {
      const csrfToken = headers().get("x-csrf-token");
      if (!csrfToken || !session.csrfToken || csrfToken !== session.csrfToken) {
        return NextResponse.json(
          { status: 403, message: "Requête refusée (CSRF token invalide ou absent)" },
          { status: 403 }
        );
      }
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        return NextResponse.json(
          { message: "Utilisateur introuvable", status: 401 },
          {
            status: 401,
          }
        );
      } else {
        session.destroy();
        return NextResponse.json({
          status: 200,
          message: "Vous êtes maintenant déconnecté",
        });
      }
    }
  } catch (error: any) {
    return handleError(error)
  }

}
