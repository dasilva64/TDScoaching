import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { validationBody } from "../../../lib/validation";
import validator from "validator";

export default withIronSessionApiRoute(
  async function editPasswordUser(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { password, pseudo } = await req.body;
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
              "Vous ne pouvez pas modifier votre mot de passe, veuillez réessayer",
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
            const encrytpPassword = async () => {
              const saltRounds = 10;
              let encrypt = await bcrypt.hash(
                validator.escape(password.trim()),
                saltRounds
              );

              let editUser = await prisma.user.update({
                where: { mail: user?.mail },
                data: { password: encrypt },
              });
              if (editUser === null) {
                return res.status(400).json({
                  status: 400,
                  type: "error",
                  message:
                    "Une erreur est survenue lors de la modification de votre mot de passe, veuillez réessayer",
                });
              } else {
                res.status(200).json({
                  status: 200,
                  message: "Votre mot de passe a été modifié avec succès",
                });
              }
            };
            encrytpPassword();
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
