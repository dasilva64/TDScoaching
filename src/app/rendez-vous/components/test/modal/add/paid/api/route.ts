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
        const { start, typeCoaching, pseudo } = (await request.json()) as {
          start: string;
          typeCoaching: string;
          pseudo: string;
        };
        let arrayMessageError = validationBody({
          start: start,
          typeCoaching: typeCoaching,
        });
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
          let date = new Date(start);
          if (date < new Date()) {
            return NextResponse.json(
              {
                status: 400,
                message: "La date ne peut pas être dans le passé",
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
            let offre = await prisma.offre_test.findUnique({
              where: {
                id: user.offreId!,
              },
            });
            if (offre === null) {
              return NextResponse.json(
                {
                  status: 404,
                  message:
                    "Sélectionnez une formule avant de prendre rendez-vous",
                },
                {
                  status: 404,
                }
              );
            } else {
              let stripeSession: any;
              try {
                stripeSession = await stripe.checkout.sessions.create({
                  line_items: [
                    {
                      price_data: {
                        currency: "eur",
                        product_data: {
                          name: offre.type !== 'flash' ? "Rendez-vous unique" : "Offre flash",
                          description: offre.type === "unique" ? `
              Date: ${new Date(start).toLocaleString("fr")} - 
              Type de coaching: ${offre.coaching}
            ` : `
              1er rendez-vous: ${new Date(start).toLocaleString("fr")} - 
              Type de coaching: ${offre.coaching} - 3×1h + bilan offert
            `,
                        },

                        unit_amount: offre.price!,
                      },

                      quantity: 1,
                    },
                  ],
                  mode: "payment",
                  customer_email: user?.mail,
                  locale: "fr",
                  payment_intent_data: { capture_method: "manual" },
                  success_url: `http://localhost:3000/redirection-vers-rendez-vous?result=success&session_id={CHECKOUT_SESSION_ID}`,
                  cancel_url: "http://localhost:3000/redirection-vers-rendez-vous?result=cancel",
                });
              } catch {
                return NextResponse.json({
                  status: 500,
                  message: "Erreur Stripe : impossible de créer la session de paiement"
                }, { status: 500 });
              }
              try {
                const { meeting, EditOffer } = await prisma.$transaction(async (tx) => {
                  const createdMeeting = await tx.meeting_test.create({
                    data: {
                      startAt: start,
                      status: "pending",
                      userMail: user?.mail!,
                      numberOfMeeting: "1"
                    }
                  });

                  const EditOffer = await tx.offre_test.update({
                    where: { id: user?.offreId! },
                    data: {
                      sessionId: stripeSession.id,
                      currentMeetingId: createdMeeting.id,
                      currentNumberOfMeeting: 1,
                      payment: false,
                      coaching: typeCoaching
                    }
                  });

                  const meeting = await tx.meeting_test.update({
                    where: { id: createdMeeting.id },
                    data: {
                      offreId: EditOffer.id
                    }
                  });

                  await tx.user.update({
                    where: { id: user?.id },
                    data: {
                      meetingId: createdMeeting.id
                    }
                  });
                  return { meeting, EditOffer }
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
                  subject: "Récapitulatif de votre rendez-vous (confirmation requise)",
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
                                                  <h2 style="text-align: center">Prise de rendez-vous</h2>
                                                  <p style="margin-bottom: 20px">Information de votre prochain rendez-vous :</p>
                                                  <ul>
                                                  <li>ID du rendez-vous : ${meeting.id}</li>
                                                  <li>Date : ${new Date(meeting.startAt).toLocaleDateString('fr')}</li>
                                                  <li>Heure : ${new Date(meeting.startAt).toLocaleTimeString('fr')}</li>
                                                  <li>Type : ${EditOffer.type}</li>
                                                  <li>Type de coaching : ${EditOffer.coaching}</li>
                                                  <li>Prix : ${EditOffer.type === "flash" ? "300€" : "100€"}</li>
                                                  </ul>
                                                 <p style="margin-bottom: 20px">
  <strong>Confirmation de paiement requise :</strong> Afin de valider votre rendez-vous, le règlement doit être effectué au moins 16h avant l’heure prévue. Sans cela, le créneau pourra être annulé.
</p>
                                                  <p style="margin-bottom: 20px">Vous pouvez consulter, confirmer, modifier ou supprimer votre rendez-vous en cliquant sur le bouton ci-dessous</p>
                                                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Mon rendez-vous</a>
                                                  <p style="margin-top: 20px">Ce message vous est personnel. Il contient des informations confidentielles concernant votre rendez-vous. Merci de ne pas le transférer sans votre accord.</p>
                                                </div>
                                              </div>
                                            </body>
                                          </html>`,
                };
                await smtpTransport.sendMail(mailOptions);
                /* let mailOptionsAdmin = {
                  from: "contact@tds-coachingdevie.fr",
                  to: "contact@tds-coachingdevie.fr",
                  subject: `[À confirmer] Prise de rendez-vous de ${user.firstname} ${user.lastname}`,
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
                                                  <h2 style="text-align: center">Prise de rendez-vous</h2>
                                                  <p style="margin-bottom: 20px">Information du rendez-vous :</p>
                                                  <ul>
                                                  <li>Prénom : ${user.firstname}</li>
                                                  <li>Nom de famille : ${user.lastname}</li>
                                                  <li>Email : ${user.mail}</li>
                                                  <li>ID du rendez-vous : ${meeting.id}</li>
                                                  <li>Date : ${new Date(meeting.startAt).toLocaleDateString('fr')}</li>
                                                  <li>Heure : ${new Date(meeting.startAt).toLocaleTimeString('fr')}</li>
                                                  <li>Type : ${EditOffer.type}</li>
                                                  <li>Type de coaching : ${EditOffer.coaching}</li>
                                                  <li>Prix : ${EditOffer.type === "flash" ? "300€" : "100€"}</li>
                                                  <li>Status : ${meeting.status}</li>
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
                    url: stripeSession.url,
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
            }


          }
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
