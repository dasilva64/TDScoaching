import prisma from "@/app/lib/prisma";
import { SessionData, sessionOptions } from "@/app/lib/session";
import { validationBody } from "@/app/lib/validation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";

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
        
        const { id } = (await request.json()) as {
          id: string;
        };
        if (!validator.isUUID(id)){
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
        
        let editUser = await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            offreId: null,
            
          }
        })
          let deleteOffre = await prisma.offre_test.delete({
            where: {
                id: id
            }
          })
          if (deleteOffre === null) {
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
          } else {
            
          return NextResponse.json({
            status: 200,
            message: `Vous avez supprimé l'ancienne offre, vous pouvez en choisir une nouvelle`,
          });
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