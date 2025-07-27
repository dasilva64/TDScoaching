import { csrfToken } from "@/app/lib/csrfToken";
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"
import { handleError } from "@/app/lib/handleError";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-meet-add-formule');
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
        const { formule, pseudo } = (await request.json()) as {
          formule: string;
          pseudo: string;
        };
        let arrayMessageError = validationBody({ formule: formule });

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
        if (pseudo.trim() !== "") {
          return NextResponse.json(
            {
              status: 400,
              message:
                "Vous ne pouvez pas choisir d'offre, veuillez réessayer",
            },
            {
              status: 400,
            }
          );
        } else {
          let createOffre = await prisma.offre_test.create({
            data: {
              type: formule,
              userId: user.id,
              price: formule === "unique" ? 100 : 300,
              status: "pending"
            }
          })
          if (createOffre === null) {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Une erreur est survenue lors de la creation de l'offre, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
          } else {
            await prisma.$transaction(async (tx) => {
              await prisma.user.update({
                where: {
                  id: user?.id
                },
                data: {
                  offreId: createOffre.id,

                }
              })
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
              subject: "Votre offre est bien enregistrée",
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
                                  <h2 style="text-align: center">Prise d'offre</h2>
                                  <p style="margin-bottom: 20px">Information de votre offre en cours :</p>
                                  <ul>
                                  <li>ID de l'offre : ${createOffre.id}</li>
                                  <li>Type de l'offre : ${createOffre.type}</li>
                                  <li>Nom : ${user.firstname} ${user.lastname}</li>
                                  <li>Prix : ${createOffre.type === "unique" ? "100€" : "300€"}</li>
                                  </ul>
                                  <p style="margin-bottom: 20px">Vous pouvez consulter, modifier ou supprimer votre offre en cliquant sur le bouton ci-dessous</p>
                                  <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Mon rendez-vous</a>
                                  <p style="margin-top: 20px">Ce message vous est personnel. Il contient des informations confidentielles concernant votre rendez-vous. Merci de ne pas le transférer sans votre accord.</p>
                                </div>
                              </div>
                            </body>
                          </html>`,
            };
            await smtpTransport.sendMail(mailOptions);
             /*let mailOptionsAdmin = {
              from: "contact@tds-coachingdevie.fr",
              to: "contact@tds-coachingdevie.fr",
              subject: `Nouvelle offre sélectionnée par ${user.firstname} ${user.lastname}`,
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
                                <h2 style="text-align: center">Prise d'offre'</h2>
                                <p style="margin-bottom: 20px">Information de l'offre en cours :</p>
                                <ul>
                                <li>Prénom : ${user.firstname}</li>
                                <li>Nom de famille : ${user.lastname}</li>
                                <li>Email : ${user.mail}</li>
                                <li>ID de l'offre : ${createOffre.id}</li>
                                  <li>Type de l'offre : ${createOffre.type}</li>
                                  <li>Prix : ${createOffre.type === "unique" ? "100€" : "300€"}</li>
                                </ul>
                                <p style="margin-bottom: 20px">Voir la page de l'utilisateur</p>
                                <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/utilisateur/${encodeURI(user.id)}" target="_blank">Page utilisateur</a>
                              </div>
                            </div>
                          </body>
                        </html>`,
            };
            await smtpTransport.sendMail(mailOptionsAdmin);  */
            return NextResponse.json({
              status: 200,
              message: `Vous avez choisi l'offre ${formule === "custom" ? "sur mesure" : formule} avec succès`,
            });
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
  } catch (error) {
    handleError(error)
  }

}