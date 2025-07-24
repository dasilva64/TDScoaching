import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { pdfSupabase } from "@/app/lib/pdfSupabase";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import { validationBody } from "@/app/lib/validation";

const supabase = createClient(
  process.env.SUPABASE_BASE_URL_UPLOAD!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-contract-edit');
    if (rateLimitResponse) return rateLimitResponse;
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
        const { signature, city, adresse, typeOffre } = (await request.json()) as {
          signature: any;
          city: any;
          adresse: any;
          typeOffre: any
        };
        let arrayMessageError = validationBody({ signature: signature, city: city, adresse: adresse, typeOffre: typeOffre });

        if (arrayMessageError.length > 0) {
          return NextResponse.json(
            {
              status: 400,
              type: "validation",
              message: arrayMessageError,
            },
            {
              status: 400,
            }
          );
        }
        if (user.offre_test === null) {
          const arrayBufferCreate: any = await pdfSupabase("ModelContrat.pdf")
          const pdfDocCreate = await PDFDocument.load(arrayBufferCreate);
          const helveticaFontCreate = await pdfDocCreate.embedFont(StandardFonts.Helvetica);

          const pagesCreate = pdfDocCreate.getPages();

          const firstPageCreate = pagesCreate[0];
          const { widthCreate, heightCreate }: any = firstPageCreate.getSize();
          firstPageCreate.drawText(`${user.firstname}${" "}${user.lastname}`, {
            x: 160,
            y: 700,
            size: 12,
            font: helveticaFontCreate,
            color: rgb(0, 0, 0),
            rotate: degrees(0),
          });
          firstPageCreate.drawText(`${typeOffre}`, {
            x: 180,
            y: 320,
            size: 12,
            font: helveticaFontCreate,
            color: rgb(0, 0, 0),
            rotate: degrees(0),
          });
          const finalPdfBytesCreate = await pdfDocCreate.save();
          const { dataCreate, errorCreate }: any = await supabase.storage
            .from("tds")
            .upload(`contrat-${user.firstname}-${user.lastname}-${user.id}.pdf`, finalPdfBytesCreate, {
              contentType: "application/pdf",
              upsert: true,
            });
        }



        const arrayBuffer: any = await pdfSupabase("contrat-" + user.firstname + "-" + user.lastname + "-" + user.id + ".pdf")
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const base64Signature = signature.replace(/^data:image\/(png|jpg);base64,/, "");

        const byteArray = Uint8Array.from(atob(base64Signature), (c) => c.charCodeAt(0));

        const signatureImage = await pdfDoc.embedPng(byteArray);
        const page = pages[2];
        const { width, height } = page.getSize();
        page.drawImage(signatureImage, {
          x: 100,
          y: 100,
          width: 300,
          height: 100,
        });
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.drawText(`${city}`, {
          x: 110,
          y: 263,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        });
        page.drawText(`${new Date().toLocaleDateString("fr")}`, {
          x: 300,
          y: 263,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        });
        page.drawText(`Lu et approuvé`, {
          x: 60,
          y: 190,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        });
        const firstPage = pages[0];
        firstPage.drawText(`${adresse}`, {
          x: 120,
          y: 687,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        });
        const finalPdfBytes = await pdfDoc.save();
        const { data, error } = await supabase.storage
          .from("tds")
          .upload(`contrat-${user.firstname}-${user.lastname}-${user.id}.pdf`, finalPdfBytes, {
            contentType: "application/pdf",
            upsert: true, // optionnel si tu veux écraser les versions précédentes
          });
        if (user.offreId) {
          let createOffre = await prisma.offre_test.update({
            where: { id: user.offreId },
            data: {
              contract_status: "SIGNED"
            }
          })
        } else {
          let createOffre = await prisma.offre_test.create({
            data: {
              type: typeOffre,
              userId: user.id,
              contract_status: "SIGNED",
              price: typeOffre === "flash" ? 300 : 100,
              status: "pending"
            }
          })
          let editUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              offreId: createOffre.id
            }
          })
        }
        return NextResponse.json(
          {
            status: 200,
            message: "Le contrat a été rempli et signé avec succès."
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
  } catch (error: any) {
    return handleError(error)
  }

}