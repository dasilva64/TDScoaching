import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";
import validator from "validator";
import { copyFile, writeFile, writeFileSync } from "fs";
import { jsPDF } from "jspdf";
import { JSDOM } from "jsdom";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default withIronSessionApiRoute(
  async function editFirstnameUser(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { signature, city } = await req.body;
        let arrayMessageError = validationBody(req.body);

        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            type: "validation",
            message: arrayMessageError,
          });
        }
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          const buf = Buffer.from(signature, "base64");
          writeFileSync(`public/assets/pdf/signature.png`, buf);
          const url = `http://localhost:3000/assets/pdf/contrat-${user.firstname}-${user.lastname}.pdf`;
          const signatureUrl = `http://localhost:3000/assets/pdf/signature.png`;
          const jpgImageBytes = await fetch(signatureUrl).then((res) =>
            res.arrayBuffer()
          );

          const existingPdfBytes = await fetch(url).then((res) =>
            res.arrayBuffer()
          );

          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
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
          firstPage.drawText(`${city}`, {
            x: 120,
            y: 687,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
            rotate: degrees(0),
          });
          const pdfBytes = await pdfDoc.save();
          const binaryPdf = Buffer.from(pdfBytes);
          // writeFileSync(`public/assets/pdf/final.pdf`, binaryPdf, "binary");
          writeFileSync(
            `public/assets/pdf/contrat-${user.firstname}-${user.lastname}.pdf`,
            binaryPdf,
            "binary"
          );
          return res.status(200).json({
            status: 200,
            message: "Votre prénom a été mis à jours avec succès",
            body: {
              firstname: user.firstname,
              lastname: user.lastname,
            },
          });
        }
      } else {
        return res.status(401).json({
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        });
      }
    } else {
      return res.status(405).json({
        status: 405,
        message:
          "La méthode de la requête n'est pas autorisé, veuillez réessayer",
      });
    }
  },
  {
    password:
      "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
    cookieName: "test",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
