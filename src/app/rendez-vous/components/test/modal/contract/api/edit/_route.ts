import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { copyFile, writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
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
        const { signature, city, adresse } = (await request.json()) as {
            signature: any;
            city: any;
            adresse: any;
          };
        /* let arrayMessageError = validationBody({ formule: formule });

        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            type: "validation",
            message: arrayMessageError,
          });
        } */
          const bufferSignature = Buffer.from(signature, "base64");
          const outputPath = path.resolve(
            "src/app/pdf",
            `signature-${user.firstname}-${user.lastname}.pdf`
          );
          writeFileSync(outputPath, bufferSignature, "binary");
          /*const url = `http://localhost:3000/assets/pdf/contrat-${user.firstname}-${user.lastname}.pdf`;
           const signatureUrl = `http://localhost:3000/assets/pdf/signature.png`;
          const jpgImageBytes = await fetch(signatureUrl).then((res) =>
            res.arrayBuffer()
          ); */
          const existingPdfBytesSignature = readFileSync(outputPath);

          const filePath = path.resolve("src/app/pdf", `contrat-${user.firstname}-${user.lastname}.pdf`);
          const existingPdfBytesPdf = readFileSync(filePath);
          /* const existingPdfBytes = await fetch(url).then((res) =>
            res.arrayBuffer()
          ); */

          const pdfDoc = await PDFDocument.load(existingPdfBytesPdf);
          const jpgImage = await pdfDoc.embedPng(existingPdfBytesSignature);
          const pages = pdfDoc.getPages();

          const page = pages[2];
          const { width, height } = page.getSize();
          page.drawImage(jpgImage, {
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
          const pdfBytes = await pdfDoc.save();
          const binaryPdf = Buffer.from(pdfBytes);
          const outputPathFinal = path.resolve(
            "src/app/pdf",
            `contrat-${user.firstname}-${user.lastname}.pdf`
          );
    
          // Vérifier si le dossier existe, sinon, le créer
          if (!existsSync(path.dirname(outputPathFinal))) {
            mkdirSync(path.dirname(outputPathFinal), { recursive: true });
          }
    
          // Écrire le fichier dans `src/app/pdf`
          writeFileSync(outputPathFinal, binaryPdf, "binary");
          /* writeFileSync(
            `public/assets/pdf/contrat-${user.firstname}-${user.lastname}.pdf`,
            binaryPdf,
            "binary"
          ); */
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
              message: "Votre prénom a été mis à jours avec succès",
              body: {
                firstname: user.firstname,
                lastname: user.lastname,
              },
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