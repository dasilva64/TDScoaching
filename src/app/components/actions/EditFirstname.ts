"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";
import { getIronSession } from "iron-session";
import prisma from "../../../../lib/prisma";
import {
  SessionData,
  sessionOptions,
  defaultSession,
} from "../../../../lib/session";
import validator from "validator";
import { validationBody } from "../../../../lib/validation";
import form from "@/app/redux/feature/form";
import { revalidatePath } from "next/cache";

const schema = z.object({
  firstname: z.string().min(3),
});

export async function EditFirstname(prevState: any, formData: FormData) {
  "use server";
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (session.isLoggedIn !== true) {
    return {
      status: 401,
      message: "Vous n'êtes pas connecté, veuillez réessayer",
    };
  } else {
    const validatedFields = schema.safeParse({
      firstname: formData.get("firstname"),
    });
    if (!validatedFields.success) {
      return {
        status: 400,
        message: "Prénom : doit comporter 3 caractères ou plus",
      };
    } else {
      let firstname = formData.get("firstname");
      let pseudo = formData.get("pseudo");
      if (pseudo?.toString().trim() !== "") {
        return {
          status: 400,
          message:
            "Vous ne pouvez pas modifier votre prénom, veuillez réessayer",
        };
      } else {
        let user = await prisma.user.findUnique({
          where: { id: session.id },
        });
        if (user === null) {
          session.destroy();
          return {
            status: 401,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          };
        } else {
          let editUser = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              firstname: validator.escape(firstname as string),
            },
          });
          if (editUser === null) {
            return {
              status: 400,
              message:
                "Une erreur est survenue lors de la modification de votre prénom, veuillez réessayer",
            };
          } else {
            /* let userObject = {
              firstname: editUser.firstname,
              lastname: editUser.lastname,
              email: editUser.mail,
              twoFactor: editUser.twoFactor,
            }; */
            revalidatePath("/profile");
            return {
              status: 200,
              message: "Votre prénom a été mis à jours avec succès",
            };
            /* return NextResponse.json({
              status: 200,
              message: "Votre prénom a été mis à jours avec succès",
              body: userObject,
            }); */
          }
        }
      }
    }
  }
}
