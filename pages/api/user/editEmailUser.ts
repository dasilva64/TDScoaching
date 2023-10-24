import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { validationBody } from "../../../lib/validation";
import validator from "validator";

export default withIronSessionApiRoute(
  async function editEmailUser(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { code, pseudo } = await req.body;
        let arrayMessageError = validationBody(req.body);
        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            type: "validation",
            message: arrayMessageError,
          });
        }

        if (pseudo.trim() !== "") {
          return res.status(400).json({
            status: 400,
            type: "error",
            message:
              "Vous ne pouvez pas modifier votre email, veuillez réessayer",
          });
        } else {
          let user = await prisma.user.findUnique({
            where: { id: req.session.user.id },
          });
          if (user === null) {
            return res.status(404).json({
              status: 404,
              message:
                "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
            });
          } else {
            let copyEditEmail: any = user.editEmail;
            if (Number(copyEditEmail.token) === Number(code)) {
              let editUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                  mail: validator.escape(copyEditEmail.newEmail),
                  editEmail: Prisma.JsonNull,
                },
              });
              if (editUser === null) {
                return res.status(400).json({
                  status: 400,
                  type: "error",
                  message:
                    "Une erreur est survenue lors de la modification de votre email, veuillez réessayer",
                });
              } else {
                let userObject = {
                  firstname: editUser.firstname,
                  lastname: editUser.lastname,
                  email: editUser.mail,
                  twoFactor: editUser.twoFactor,
                };
                return res.status(200).json({
                  status: 200,
                  message: "Votre nouvel email est maintenant actif",
                  body: userObject,
                });
              }
            } else {
              return res.status(400).json({
                status: 400,
                type: "error",
                message: "Le code n'est pas correct, veuillez réessayer",
              });
            }
          }
        }
      } else {
        return res.status(401).json({
          status: 401,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        });
      }
    } else {
      return res.status(405).json({
        status: 405,
        message: "Une erreur est survenue, veuillez réessayer",
      });
    }
  },
  {
    password:
      "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
    cookieName: "test",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
