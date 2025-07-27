import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { createClient } from "@supabase/supabase-js";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"

const supabase = createClient(
  process.env.SUPABASE_BASE_URL_UPLOAD!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // attention : à utiliser seulement côté serveur !
)

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkRateLimitShort(request, 'rlflx-offre-edit');
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
        if (user.meetingId) {
          return NextResponse.json(
            {
              status: 400,
              type: "error",
              message:
                "Vous ne pouvez pas changer d'offre car vous avez un rendez-vous de prévu",
            },
            {
              status: 400,
            }
          );
        }
        const offre = await prisma.offre_test.findUnique({
          where: { id: user.offreId! }
        })
        if (offre!.type === "flash") {
          if (offre?.currentNumberOfMeeting === 0 || offre?.currentNumberOfMeeting === null) {
            try {
              let previousOffre = offre.type
              if (offre?.contract_status === "SIGNED" || offre?.contract_status === "GENERATED_NAME_ONLY" || offre?.contract_status === "CONFIRMED") {
                await supabase.storage.from('tds').remove(["contrat-" + user.firstname + "-" + user.lastname + ".pdf"])
              }
              await prisma.$transaction(async (tx) => {
                await prisma.user.update({
                  where: {
                    id: user?.id
                  },
                  data: {
                    offreId: null,
                  }
                })
                await prisma.offre_test.delete({
                  where: {
                    id: offre.id,
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
                subject: "Changement d'offre",
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
                                                <p style="margin-bottom: 20px">Vous avez annulez votre ancienne offre ${previousOffre}.</p>
                                                <p style="margin-bottom: 20px">Vous pouvez reprendre une nouvelle offre en cliquant sur le bouton ci dessous.</p>
                                                <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/rendez-vous" target="_blank">Mes offre</a>
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
               subject: `Changement d'offre par ${user.firstname} ${user.lastname}`,
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
                                 <h2 style="text-align: center">Changement d'offre</h2>
                                 <p style="margin-bottom: 20px">L'utilisateur ${user.firstname} ${user.lastname} a annulé son ancienne offre ${previousOffre}.</p>
                                 <p style="margin-bottom: 20px">Voir la page de l'utilisateur</p>
                                 <a style="text-decoration: none; padding: 10px; border-radius: 10px; cursor: pointer; background: orange; color: white" href="https://tdscoaching.fr/utilisateur/${encodeURI(user.id)}" target="_blank">Page utilisateur</a>
                               </div>
                             </div>
                           </body>
                         </html>`,
             };
             await smtpTransport.sendMail(mailOptionsAdmin);  */
              let link = null;
              const { allMeeting, meeting, offreReturn, allOffresWithMeetings } = await prisma.$transaction(async (tx) => {
                const allMeeting = await tx.meeting_test.findMany({
                  where: {
                    startAt: { gte: new Date() },
                    status: { not: "cancelled" },
                  },
                  select: {
                    startAt: true,
                    userMail: true,
                  },
                });

                const meeting = user?.meetingId
                  ? await tx.meeting_test.findUnique({ where: { id: user.meetingId } })
                  : null;

                const offreReturn = user?.offreId
                  ? await tx.offre_test.findUnique({ where: { id: user.offreId } })
                  : null;

                const allOffresWithMeetings = user?.offreId
                  ? await tx.offre_test.findUnique({
                    where: { id: user.offreId },
                    include: {
                      meeting_test_meeting_test_offreIdTooffre_test: {
                        select: {
                          id: true,
                          status: true,
                          startAt: true,
                          numberOfMeeting: true,
                        },
                      },
                    },
                  })
                  : null;

                return { allMeeting, meeting, offreReturn, allOffresWithMeetings };
              });

              let updatedArray;
              if (allOffresWithMeetings) {
                updatedArray = allOffresWithMeetings.meeting_test_meeting_test_offreIdTooffre_test.filter(obj => obj.status !== "cancelled");
              }

              let userObject = {
                meetings: allMeeting,
                meeting: meeting,
                offre: offreReturn,
                discovery: user.discovery,
                link: link,
                meetingsByUser: updatedArray ? updatedArray.sort((a: any, b: any) => a.numberOfMeeting - b.numberOfMeeting) : null
              };
              return NextResponse.json({
                status: 200,
                body: userObject,
                message: `Vous avez supprimé l'ancienne offre, vous pouvez en choisir une nouvelle`,
              });

            } catch {
              return NextResponse.json(
                {
                  status: 400,
                  type: "error",
                  message:
                    "Une erreur est survenue lors du changement de l'offre, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }

          } else {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Vous ne pouvez pas changer d'offre, vous devez l'annuler",
              },
              {
                status: 400,
              }
            );

          }

        } else {
          try {
            await prisma.$transaction(async (tx) => {

              await prisma.user.update({
                where: {
                  id: user?.id
                },
                data: {
                  offreId: null,

                }
              })
              await prisma.offre_test.delete({
                where: {
                  id: offre?.id
                }
              })
            })
            return NextResponse.json({
              status: 200,
              message: `Vous avez supprimé l'ancienne offre, vous pouvez en choisir une nouvelle`,
            });
          } catch {
            return NextResponse.json(
              {
                status: 400,
                type: "error",
                message:
                  "Une erreur est survenue lors du changement de l'offre, veuillez réessayer",
              },
              {
                status: 400,
              }
            );
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