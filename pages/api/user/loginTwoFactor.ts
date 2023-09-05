import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import { validationBody } from "../../../lib/validation";
import validator from "validator";
import { Prisma } from "@prisma/client";
import edit from "../meeting/edit";

export default withIronSessionApiRoute(
  async function login(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      const { email, password, pseudo, code } = await req.body;
      let arrayMessageError = validationBody(req.body);
      if (arrayMessageError.length > 0) {
        return res.status(400).json({
          status: 400,
          message: arrayMessageError,
        });
      }
      if (pseudo.trim() !== "") {
        return res.status(404).json({
          status: 404,
          message:
            "Une erreur est survenue lors de la connection, veuillez réessayer plus tard",
        });
      } else {
        const user = await prisma.user.findUnique({
          where: {
            mail: validator.escape(email),
          },
        });
        if (user) {
          const decode = await bcrypt.compare(
            validator.escape(password),
            user.password
          );
          if (decode === false) {
            return res.status(404).json({
              status: 404,
              message:
                "Mauvaise combinaison email/mot de passe, veuillez réessayer",
            });
          } else {
            if (user.twoFactor === true) {
              let copyTwoFactorCode: any = user.twoFactorCode;
              if (Number(copyTwoFactorCode.token) === Number(code)) {
                let editUser = await prisma.user.update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    twoFactorCode: Prisma.JsonNull,
                  },
                });
                if (editUser === null) {
                  return res.status(404).json({
                    status: 404,
                    message:
                      "L'utilisateur n'as pas pu être modifié, veuillez réessayer",
                  });
                } else {
                  let userObject = {
                    role: user.role,
                    id: user.id,
                  };
                  req.session.user = userObject;
                  await req.session.save();
                  return res.status(200).json({
                    status: 200,
                    body: userObject,
                    message: `Bonjour, ${user.firstname} vous êtes maintenant connecté`,
                  });
                }
              } else {
                return res.status(404).json({
                  status: 404,
                  message: "Le code n'est pas correct, veuillez réessayer",
                });
              }
            } else {
              res.status(404).json({
                status: 404,
                message: "Une erreur est survenue, veuillez réessayer",
              });
            }
          }
        } else {
          return res.status(404).json({
            status: 404,
            message:
              "Mauvaise combinaison email/mot de passe, veuillez réessayer",
          });
        }
      }
    } else {
      res.status(404).json({
        status: 404,
        message: "Une erreur est survenue, veuillez réessayer",
      });
    }
  },
  async (req, res) => {
    const { remember } = await req.body;
    return {
      password:
        "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
      cookieName: "test",
      cookieOptions: {
        maxAge: remember ? 60 * 60 * 24 * 30 : undefined,
        secure: process.env.NODE_ENV === "production",
      },
    };
  }
);
