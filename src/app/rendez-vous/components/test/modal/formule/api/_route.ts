import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  
    if (session.isLoggedIn === true) {
      let user = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (user === null) {
        session.destroy();
        return NextResponse.json(
          {
            status: 400,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          },
          {
            status: 400,
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
              userId: user.id
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
            let editUser = await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              offreId: createOffre.id,
              discovery: false
              
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
  }