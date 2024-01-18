import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "../../../../../../../lib/prisma";
import nodemailer from "nodemailer";
import {
  SessionData,
  sessionOptions,
  defaultSession,
} from "../../../../../../../lib/session";
import validator from "validator";
import { validationBody } from "../../../../../../../lib/validation";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn !== true) {
    return Response.json(
      {
        status: 401,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
      },
      { status: 401 }
    );
  } else {
    let user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    if (user === null) {
      return Response.json(
        {
          status: 404,
          message:
            "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
        },
        { status: 404 }
      );
    } else {
      const updateUser = await prisma.user.update({
        where: { mail: user.mail },
        data: {
          editEmail: Prisma.JsonNull,
        },
      });
      if (updateUser === null) {
        return Response.json(
          {
            status: 400,
            message:
              "Une erreur est survenue lors de la modification de votre email, veuillez réessayer",
          },
          { status: 400 }
        );
      } else {
        let userObject = {
          id: updateUser.id,
          role: updateUser.role,
          firstname: updateUser.firstname,
          lastname: updateUser.lastname,
          email: updateUser.mail,
          editEmail: updateUser.editEmail,
        };
        return Response.json({
          status: 200,
          message: "Votre demande de modification d'email à été annulé",
          body: userObject,
        });
      }
    }
  }
}
