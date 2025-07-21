import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const handleError = (error: any) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return NextResponse.json({
            status: 409,
            message: "Une donnée unique existe déjà (ex: email déjà pris)",
          }, { status: 409 });
        case 'P2003':
          return NextResponse.json({
            status: 400,
            message: "Relation invalide : la référence associée est introuvable",
          }, { status: 400 });
        case 'P2005':
          return NextResponse.json({
            status: 400,
            message: "Format de champ incorrect : données mal formées ou invalides",
          }, { status: 400 });
        case 'P2025':
          return NextResponse.json({
            status: 404,
            message: "L'élément que vous tentez d'utiliser n'existe pas",
          }, { status: 404 });
        default:
          return NextResponse.json({
            status: 500,
            message: `Une erreur technique est survenue (code Prisma : ${error.code})`,
          }, { status: 500 });
      }
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({
        status: 400,
        message: "Erreur de validation des données. Vérifiez les champs requis.",
      }, { status: 400 });
    }
    return NextResponse.json({
      status: 500,
      message: "Oups, notre serveur a rencontré un problème. Veuillez réessayer plus tard.",
    }, { status: 500 });

}