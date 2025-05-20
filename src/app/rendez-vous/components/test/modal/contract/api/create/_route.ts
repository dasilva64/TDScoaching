import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import {
  copyFile,
  writeFileSync,
  readFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { cookies } from "next/headers";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: NextRequest) {
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
      const { type } = (await request.json()) as {
        type: string;
      };
      let arrayMessageError = validationBody({ type: type });

      if (arrayMessageError.length > 0) {
        return NextResponse.json(
          {
            status: 400,
            message: "Une erreur est survenue, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      }
      const url = `http://localhost:3000/assets/pdf/ModelContrat.pdf`;
      /* const existingPdfBytes = await fetch(url).then((res) =>
            res.arrayBuffer()
          ); */
      const filePath = path.resolve("src/app/pdf", "ModelContrat.pdf");
      const existingPdfBytes = readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
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
      firstPage.drawText(`${type}`, {
        x: 180,
        y: 320,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      });
      const pdfBytes = await pdfDoc.save();
      const binaryPdf = Buffer.from(pdfBytes);

      // Nouveau chemin pour sauvegarder le PDF modifié dans `src/app/pdf`
      const outputPath = path.resolve(
        "src/app/pdf",
        `contrat-${user.firstname}-${user.lastname}.pdf`
      );

      // Vérifier si le dossier existe, sinon, le créer
      if (!existsSync(path.dirname(outputPath))) {
        mkdirSync(path.dirname(outputPath), { recursive: true });
      }

      // Écrire le fichier dans `src/app/pdf`
      writeFileSync(outputPath, binaryPdf, "binary");
      const response = new NextResponse(binaryPdf, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf', // Ou un autre type MIME selon ton fichier
          'Content-Disposition': 'attachment; filename="contrat.pdf"' // Si tu veux que le fichier soit téléchargé
        },
      });
    
      return response;
      return NextResponse.json(
        {
          status: 200,
          data: binaryPdf,
        },
        {
          headers: { 'content-type': 'application/pdf' },
          status: 200,
        }
      );
      return new Response(binaryPdf, { headers: { 'content-type': 'image/png' } });
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
