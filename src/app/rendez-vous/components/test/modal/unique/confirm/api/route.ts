import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import Stripe from "stripe";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { csrfToken } from "@/app/lib/csrfToken";
import nodemailer from "nodemailer";
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-meet-confirm-paid');
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
          meeting_test: true,
          offre_test: true,
        },
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
        let offre = await prisma.offre_test.findUnique({
          where: { id: user.offreId! }
        })
        if (!offre) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous n'avez pas d'offre en cours, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        if (user.offre_test!.type === "unique" && user.meetingId === null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous n'avez pas de rendez-vous en cours, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        if (user.offre_test!.type === "flash" && user.meetingId !== null) {
          return NextResponse.json(
            {
              status: 400,
              message: "Vous avez déjà un rendez-vous en cours, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        }
        if (user.meeting_test?.status !== "not_confirmed") {
          return NextResponse.json(
            {
              status: 400,
              message: "Votre rendez-vous n'est pas a confirmé",
            },
            {
              status: 400,
            }
          );
        }
        try {
          const { meeting } = await prisma.$transaction(async (tx) => {
            let meeting = await prisma.meeting_test.update({
              where: {
                id: user?.meetingId!,
              },
              data: {
                status: "confirmed",
              },
            })
            return { meeting }
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
                         subject: "Confirmation de votre rendez-vous",
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
                                                         <h2 style="text-align: center">Rendez-vous confirmé</h2>
                                                         <p style="margin-bottom: 20px">Information de votre rendez-vous :</p>
                                                         <ul>
                                                         <li>ID du rendez-vous : ${meeting.id}</li>
                                                         <li>Date : ${new Date(meeting.startAt).toLocaleDateString('fr')}</li>
                                                         <li>Heure : ${new Date(meeting.startAt).toLocaleTimeString('fr')}</li>
                                                         <li>Type : ${offre.type}</li>
                                                         <li>Type de coaching : ${offre.coaching}</li>
                                                         <li>Prix : ${offre.type === "flash" ? "300€" : "100€"}</li>
                                                         </ul>
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
                         subject: `[Confirmation] Rendez-vous de ${user.firstname} ${user.lastname}`,
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
                                                       <div style="; background: aqua; padding: 50px 0px 50px 20px; border-radius: 20px">
                                                         <h1 style="text-align: center">tds coaching</h1>
                                                         <h2 style="text-align: center">Confirmation de rendez-vous</h2>
                                                         <p style="margin-bottom: 20px">Information du rendez-vous confirmé :</p>
                                                         <ul>
                                                         <li>Prénom : ${user.firstname}</li>
                                                         <li>Nom de famille : ${user.lastname}</li>
                                                         <li>Email : ${user.mail}</li>
                                                         <li>ID du rendez-vous : ${meeting.id}</li>
                                                         <li>Date : ${new Date(meeting.startAt).toLocaleDateString('fr')}</li>
                                                         <li>Heure : ${new Date(meeting.startAt).toLocaleTimeString('fr')}</li>
                                                         <li>Type : ${offre.type}</li>
                                                         <li>Type de coaching : ${offre.coaching}</li>
                                                         <li>Prix : ${offre.type === "flash" ? "300€" : "100€"}</li>
                                                         <li>Status : ${meeting.status}</li>
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
              body: { meeting },
              message: "Votre rendez-vous a bien été confirmé"
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
                "Une erreur est survenue lors de la confirmation du rendez-vous, veuillez réessayer",
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
  } catch (error: any) {
    return handleError(error)
  }
}