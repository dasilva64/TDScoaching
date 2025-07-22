import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import { pdfSupabase } from "@/app/lib/pdfSupabase";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { createClient } from "@supabase/supabase-js";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '60s'),
});

const supabase = createClient(
  process.env.SUPABASE_BASE_URL_UPLOAD!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Clé privée côté serveur uniquement
);

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? 'ip';
    const keyPrefix = "rlflx-contract-refresh";
    const key = `${keyPrefix}:${ip}`
    const { success, remaining } = await ratelimit.limit(key);

    if (!success) {
      return NextResponse.json(
        {
          status: 429,
          message: "Trop de requêtes, veuillez réessayer plus tard",
        },
        { status: 429 }
      );
    }
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );
    const csrfTokenHeader = headers().get("x-csrf-token");
    const csrfCheckResponse = csrfToken(csrfTokenHeader, session.csrfToken);
    if (csrfCheckResponse) return csrfCheckResponse;
    if (session.isLoggedIn === true) {
      let user = await prisma.user.findUnique({
        where: { id: session.id },
        include: {
          offre_test: true
        }
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
        const { typeOffre } = (await request.json()) as {
          typeOffre: string;
        };
        let arrayMessageError = validationBody({ typeOffre: typeOffre });
        if (arrayMessageError.length > 0) {
          return NextResponse.json(
            {
              status: 400,
              type: "validation",
              message: "Une erreur est survenue, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        try {
          if (user.offre_test === null) {
            const arrayBuffer: any = await pdfSupabase("ModelContrat.pdf")
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const pages = pdfDoc.getPages();

            const firstPage = pages[0];
            const { width, height } = firstPage.getSize();
            firstPage.drawText(`${user.firstname}${" "}${user.lastname}`, {
              x: 160,
              y: 700,
              size: 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
              rotate: degrees(0),
            });
            firstPage.drawText(`${typeOffre}`, {
              x: 180,
              y: 320,
              size: 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
              rotate: degrees(0),
            });
            const finalPdfBytes = await pdfDoc.save();
            await supabase.storage
              .from("tds")
              .upload(`contrat-${user.firstname}-${user.lastname}-${user.id}.pdf`, finalPdfBytes, {
                contentType: "application/pdf",
                upsert: true,
              });
          }
          const apiUrl = process.env.SUPABASE_STORAGE_URL_TEST as string;
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const response = await fetch(apiUrl + "-" + user.firstname + "-" + user.lastname + "-" + user.id + ".pdf", {
            method: "POST",
            headers: {
              apikey: serviceRoleKey,
              Authorization: `Bearer ${serviceRoleKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ expiresIn: 60 }), // Expiration en secondes
          });
          const { signedURL } = await response.json();
          const fullUrl = `${process.env.SUPABASE_BASE_URL_FETCH}${signedURL}`;
          if (user.offreId === null) {
            await prisma.$transaction(async (tx) => {
              let createOffre = await prisma.offre_test.create({
                data: {
                  type: typeOffre,
                  userId: user?.id!,
                  contract_status: "GENERATED_NAME_ONLY",
                  price: typeOffre === "flash" ? 300 : 100,
                  status: "pending"
                }
              })
              await prisma.user.update({
                where: { id: user?.id },
                data: {
                  offreId: createOffre.id
                }
              })
            })
          }
          return NextResponse.json(
            {
              status: 200,
              body: fullUrl,
            },
            {
              status: 200,
            }
          );
        } catch {
          return NextResponse.json(
            {
              status: 400,
              message: "Une erreur est survenue lors de la creation du contrat, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }

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
  catch (error: any) {
    return handleError(error)
  }
}