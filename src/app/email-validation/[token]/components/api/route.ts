import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import prisma from "../../../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { token } = (await request.json()) as {
    token: string;
  };

  if (token && validator.escape(token.trim()).length > 0) {
    const { verify } = jwt;
    const decodeToken: any = verify(
      validator.escape(token.trim()),
      process.env.SECRET_TOKEN_REGISTER as string
    );
    let user = await prisma.user.findUnique({
      where: { mail: decodeToken.user },
    });
    if (user === null) {
      return NextResponse.json(
        {
          status: 404,
          message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
        },
        { status: 404 }
      );
    } else {
      if (user.registerToken && user.status === false) {
        let copyRegisterToken: any = user?.registerToken;
        if (validator.escape(token.trim()) === copyRegisterToken.token) {
          if (new Date().getTime() > copyRegisterToken.limitDate) {
            const deleteUser = await prisma.user.delete({
              where: { mail: user.mail },
            });
            return NextResponse.json(
              {
                status: 404,
                message:
                  "Le lien de validation de votre est plus valide, vous pouvez un créer un nouveau compte",
              },
              { status: 404 }
            );
          } else {
            if (user.status === false) {
              let editUser = await prisma.user.update({
                where: { id: user.id },
                data: { status: true, registerToken: Prisma.JsonNull },
              });
              return NextResponse.json({
                status: 200,
                message:
                  "Votre compte est activé, vous pouvez maintenant vous connecter",
              });
            }
          }
        } else {
          return NextResponse.json(
            {
              status: 404,
              message: "Le token n'est pas valide, veuillez réessayer",
              body: user,
            },
            { status: 404 }
          );
        }
      } else {
        return NextResponse.json(
          {
            status: 404,
            message: "Votre compte est déjà activé, vous pouvez vous connecter",
          },
          { status: 404 }
        );
      }
    }
  } else {
    return NextResponse.json(
      {
        status: 404,
        message: "Le token n'est pas valide, veuillez réessayer",
      },
      { status: 404 }
    );
  }
}
