import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import Stripe from "stripe";
import nodemailer from "nodemailer"
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import { pdfSupabase } from "@/app/lib/pdfSupabase";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_BASE_URL_UPLOAD!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Clé privée côté serveur uniquement
);

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-meet-add-paid');
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
        const { typeCoaching, pseudo, contratInput } = (await request.json()) as {
          typeCoaching: string;
          pseudo: string;
          contratInput: boolean
        };
        let arrayMessageError = validationBody({
          typeCoaching: typeCoaching,
          contratInput: contratInput
        });
        if (arrayMessageError.length > 0) {
          if (arrayMessageError.length === 1) {
            if (arrayMessageError[0][0] === "unknown_fields") {
              return NextResponse.json(
                {
                  status: 400,
                  message: arrayMessageError[0][1],
                },
                {
                  status: 400,
                }
              );
            }
          }
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
        if (pseudo.trim() !== "") {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message: "Vous ne pouvez pas créer un rendez-vous, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        if (user.meetingId !== null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà un rendez-vous de pris",
            },
            {
              status: 400,
            }
          );
        } else {
          const stripe = new Stripe(
            process.env.STRIPE as string, {
            apiVersion: '2022-11-15',
            typescript: true
          }
          );
          let setupIntent: any;
          try {
            const existingCustomers = await stripe.customers.list({
              email: user.mail,
              limit: 1,
            });

            let customer;
            if (existingCustomers.data.length > 0) {
              customer = existingCustomers.data[0];
            } else {
              customer = await stripe.customers.create({
                name: `${user.firstname} ${user.lastname}`,
                email: user.mail,
              });
            }
            setupIntent = await stripe.setupIntents.create({
              customer: customer.id,
              usage: 'off_session',
              description: "unique",
              payment_method_types: ['card'],
            });
          } catch {
            return NextResponse.json({
              status: 500,
              message: "Erreur Stripe : impossible de créer la session de paiement"
            }, { status: 500 });
          }
          try {
            const { createOffre } = await prisma.$transaction(async (tx) => {

              let createOffre = await tx.offre_test.create({
                data: {
                  type: "flash",
                  userId: user?.id!,
                  price: 300,
                  hasCard: false,
                  status: "pending",
                  currentNumberOfMeeting: 0,
                  coaching: typeCoaching,

                }
              })

              await tx.user.update({
                where: { id: user?.id },
                data: {
                  offreId: createOffre.id
                }
              });
              return { createOffre }
            });
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
            firstPage.drawText(`flash`, {
              x: 180,
              y: 320,
              size: 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
              rotate: degrees(0),
            });
            const finalPdfBytes = await pdfDoc.save();
            await supabase.storage
              .from("prive-contrat")
              .upload(`contrat-${user.firstname}-${user.lastname}-${user.id}.pdf`, finalPdfBytes, {
                contentType: "application/pdf",
                upsert: true,
              });
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
             subject: "Récapitulatif de votre formule (confirmation requise)",
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
                                             <h2 style="text-align: center">Prise de formule</h2>
                                             <p style="margin-bottom: 20px">Information de votre formule :</p>
                                             <ul>
                                             <li>ID de l'offre : ${createOffre.id}</li>
                                             <li>Type : ${createOffre.type}</li>
                                             <li>Type de coaching : ${createOffre.coaching}</li>
                                             <li>Prix : ${createOffre.type === "flash" ? "300€" : "100€"}</li>
                                             </ul>
                                            <p style="margin-bottom: 20px">
<strong>Confirmation de paiement requise :</strong> Afin de valider votre offre, le règlement doit être effectué au moins 16h avant l’heure prévue. Sans cela, le créneau pourra être annulé.
</p>
                                             <p style="margin-bottom: 20px">Vous pouvez consulter, confirmer, modifier ou supprimer votre offre en cliquant sur le bouton ci-dessous</p>
                                             <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Mon rendez-vous</a>
                                             <p style="margin-top: 20px">Ce message vous est personnel. Il contient des informations confidentielles concernant votre rendez-vous. Merci de ne pas le transférer sans votre accord.</p>
                                           </div>
                                         </div>
                                       </body>
                                     </html>`,
           };
           await smtpTransport.sendMail(mailOptions);
            let mailOptionsAdmin = {
             from: "contact@tds-coachingdevie.fr",
             to: "contact@tds-coachingdevie.fr",
             subject: `[À confirmer] Prise formule de ${user.firstname} ${user.lastname}`,
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
                                             <h2 style="text-align: center">Prise formule</h2>
                                             <p style="margin-bottom: 20px">Information de la formule :</p>
                                             <ul>
                                             <li>Prénom : ${user.firstname}</li>
                                             <li>Nom de famille : ${user.lastname}</li>
                                             <li>Email : ${user.mail}</li>
                                             <li>ID de la formule : ${createOffre.id}</li>
                                             <li>Type : ${createOffre.type}</li>
                                             <li>Type de coaching : ${createOffre.coaching}</li>
                                             <li>Prix : ${createOffre.type === "flash" ? "300€" : "100€"}</li>
                                             </ul>
                                             <p style="margin-bottom: 20px">Voir la page de l'utilisateur</p>
                                             <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/utilisateur/${encodeURI(user.id)}" target="_blank">Page utilisateur</a>
                                           </div>
                                         </div>
                                       </body>
                                     </html>`,
           };
           await smtpTransport.sendMail(mailOptionsAdmin);
            return NextResponse.json(
              {
                status: 200,
                body: {
                  client_secret: setupIntent.client_secret,
                  offre: createOffre,
                },
              },
              {
                status: 200,
              }
            );
          } catch {
            return NextResponse.json(
              {
                status: 400,
                message:
                  "Une erreur est survenue lors de la création du rendez-vous, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          }



          //}
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
  } catch (error: any) {
    return handleError(error)
  }
}
