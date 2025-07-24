import { csrfToken } from "@/app/lib/csrfToken";
import prisma from "@/app/lib/prisma";
import { checkRateLimitShort } from "@/app/lib/rateLimiter";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
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
            await prisma.user.update({
              where: {
                id: user.id
              },
              data: {
                offreId: createOffre.id,

              }
            })
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