import { csrfToken } from "@/app/lib/csrfToken";
import { handleError } from "@/app/lib/handleError";
import prisma from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { createClient } from "@supabase/supabase-js";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_BASE_URL_UPLOAD!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // attention : à utiliser seulement côté serveur !
)

export async function POST(request: NextRequest) {
  try {
   /*  const rateLimitResponse = await checkRateLimit(request, {
      points: 5,
      duration: 60,
      keyPrefix: "rlflx-offre-edit"
    });
    if (rateLimitResponse) return rateLimitResponse; */
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
                    id: offre.id
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