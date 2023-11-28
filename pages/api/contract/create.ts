import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";
import validator from "validator";
import { copyFile, writeFileSync } from "fs";
import { jsPDF } from "jspdf";
import { JSDOM } from "jsdom";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default withIronSessionApiRoute(
  async function editFirstnameUser(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { type } = await req.body;
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
          /* copyFile(
            "public/assets/pdf/test.pdf",
            `public/assets/pdf/contrat-${firstname}-${lastname}.pdf`,
            (err) => {
              if (err) throw err;
              console.log("source.txt was copied to destination.txt");
            }
          );

          const url = `http://localhost:3000/assets/pdf/contrat-${firstname}-${lastname}.pdf`;
          const existingPdfBytes = await fetch(url).then((res) =>
            res.arrayBuffer()
          );

          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

          const pages = pdfDoc.getPages();

          const firstPage = pages[0];
          const { width, height } = firstPage.getSize();
          firstPage.drawText("This text was added with JavaScript!", {
            x: 5,
            y: height / 2 + 300,
            size: 50,
            font: helveticaFont,
            color: rgb(0.95, 0.1, 0.1),
            rotate: degrees(-45),
          });
          const pdfBytes = await pdfDoc.save();
          const binaryPdf = Buffer.from(pdfBytes);
          writeFileSync(
            "public/assets/pdf/contdsfsdf.pdf",
            binaryPdf,
            "binary"
          ); */
          const url = `http://localhost:3000/assets/pdf/ModelContrat.pdf`;
          const existingPdfBytes = await fetch(url).then((res) =>
            res.arrayBuffer()
          );

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
