import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import { pdfSupabase } from "@/app/lib/pdfSupabase";
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { createClient } from "@supabase/supabase-js";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

const supabase = createClient(
  process.env.SUPABASE_BASE_URL_UPLOAD!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Clé privée côté serveur uniquement
);

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-contract-refresh');
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
            const { createOffre } = await prisma.$transaction(async (tx) => {
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
              return { createOffre }
            })
             let smtpTransport = nodemailer.createTransport({
              host: "smtp.ionos.fr",
              port: 465,
              secure: true,
              auth: {
                user: process.env.SECRET_SMTP_EMAIL,
                pass: process.env.SECRET_SMTP_PASSWORD,
              },
            });
            let mailOptions = {
              from: "contact@tds-coachingdevie.fr",
              to: user.mail,
              subject: `Offre ${createOffre.type} à signé`,
              html: `<!DOCTYPE html>
                          <html lang="fr">
                            <head>
                              <title>tds coaching</title>
                              <meta charset="UTF-8" />
                              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                              <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                              <title>Document</title>
                            </head>
                            <body>
                              
                              <div style="width: 100%">
                                <div style="text-align: center">
                                  <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                                </div>
                                <div style="background: aqua; padding: 50px 0px 50px 20px; border-radius: 20px">
                                  <h1 style="text-align: center">tds coaching</h1>
                                  <h2 style="text-align: center">Contrat en attente de signature</h2>
                                  <p style="margin-bottom: 20px">Vous avez sélectionné une offre flash :</p>
                                  <ul>
                                    <li>ID de l'offre : ${createOffre.id}</li>
                                    <li>Type de l'offre : ${createOffre.type}</li>
                                    <li>Nom : ${user.firstname} ${user.lastname}</li>
                                    <li>Prix : ${createOffre.type === "unique" ? "100€" : "300€"}</li>
                                    <li>Statut du contrat : ${createOffre.contract_status === "GENERATED_NAME_ONLY" ? "En attente de signature" : createOffre.contract_status === "SIGNED" ? "En attente de confirmation" : "Erreur" }</li>
                                  </ul>
                                  <p style="margin-bottom: 20px">⚠️ Ce contrat n’est pas encore signé et confirmé. L’offre sera prise en compte qu’une fois votre validation effectuée sur le site.</p>
                                  <p style="margin-bottom: 20px">Votre contrat personnalisé est disponible et téléchargeable depuis votre espace client sur le site TDS Coaching. Vous pouvez le consulter à tout moment avant ou après la confirmation de votre offre.</p>
                                  <p style="margin-bottom: 20px">Vous pouvez consulter, modifier ou confirmer votre contrat en cliquant sur le bouton ci-dessous</p>
                                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Mon rendez-vous</a>
                                  <p style="margin-top: 20px">Ce message vous est personnel. Il contient des informations confidentielles concernant votre rendez-vous. Merci de ne pas le transférer sans votre accord.</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
            };
            await smtpTransport.sendMail(mailOptions);/*
            let mailOptionsAdmin = {
              from: "contact@tds-coachingdevie.fr",
              to: "contact@tds-coachingdevie.fr",
              subject: `[A SIGNER] Nouvelle offre sélectionnée par ${user.firstname} ${user.lastname}`,
              html: `<!DOCTYPE html>
                        <html lang="fr">
                          <head>
                            <title>tds coaching</title>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                            <title>Document</title>
                          </head>
                          <body>
                            
                            <div style="width: 100%">
                              <div style="text-align: center">
                                <img src="https://tdscoaching.fr/_next/image?url=%2Fassets%2Flogo%2Flogo3.webp&w=750&q=75" width="80px" height="80px" />
                              </div>
                              <div style="background: aqua; padding: 50px 0px 50px 20px; border-radius: 20px">
                                <h1 style="text-align: center">tds coaching</h1>
                                <h2 style="text-align: center">Contrat en attente de signature</h2>
                                <p style="margin-bottom: 20px">L'utilisateur <strong>${user.firstname} ${user.lastname}</strong> (${user.mail}) a sélectionné une offre :</p>
                                <ul>
                                <li>Prénom : ${user.firstname}</li>
                                <li>Nom de famille : ${user.lastname}</li>
                                <li>Email : ${user.mail}</li>
                                <li>ID de l'offre : ${createOffre.id}</li>
                                  <li>Type de l'offre : ${createOffre.type}</li>
                                  <li>Status du contrat : ${createOffre.contract_status}</li>
                                  <li>Prix : ${createOffre.type === "unique" ? "100€" : "300€"}</li>
                                </ul>
                                <p style="margin-bottom: 20px">Voir la page de l'utilisateur</p>
                                <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/utilisateur/${encodeURI(user.id)}" target="_blank">Page utilisateur</a>
                              </div>
                            </div>
                          </body>
                        </html>`,
            };
            await smtpTransport.sendMail(mailOptionsAdmin); */
            return NextResponse.json(
            {
              status: 200,
              body: fullUrl,
            },
            {
              status: 200,
            }
          );
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