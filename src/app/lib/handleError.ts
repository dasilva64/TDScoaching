import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const handleError = (error: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const targetField = (error.meta as { target?: string[] })?.target?.[0] ?? 'champ inconnu';
        return NextResponse.json({
          status: 409,
          message: `Une valeur existe déjà pour le champ unique '${targetField}'`,
        }, { status: 409 });

      case 'P2003':
        return NextResponse.json({
          status: 400,
          message: "Relation invalide : l'élément référencé est introuvable.",
        }, { status: 400 });

      case 'P2005':
        return NextResponse.json({
          status: 400,
          message: "Format incorrect : les données envoyées ne sont pas valides.",
        }, { status: 400 });

      case 'P2025':
        return NextResponse.json({
          status: 404,
          message: "L'élément ciblé n'existe pas ou a déjà été supprimé.",
        }, { status: 404 });

      default:
        return NextResponse.json({
          status: 500,
          message: `Erreur technique Prisma (code : ${error.code}).`,
        }, { status: 500 });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({
      status: 400,
      message: "Erreur de validation : les données ne respectent pas le schéma attendu.",
    }, { status: 400 });
  }

  return NextResponse.json({
    status: 500,
    message: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
  }, { status: 500 });
};
