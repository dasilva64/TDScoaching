import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import { validationBody } from "../../../lib/validation";
import validator from "validator";

export default withIronSessionApiRoute(
  async function login(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      const { email, password, pseudo } = await req.body;
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
            if (user.status === false && user.registerToken) {
              let copyRegisterToken: any = user?.registerToken;
              if (new Date().getTime() > copyRegisterToken.limitDate) {
                const deleteUser = await prisma.user.delete({
                  where: { mail: user.mail },
                });
                return res.status(404).json({
                  status: 404,
                  message:
                    "Mauvaise combinaison email/mot de passe, veuillez réessayer",
                });
              }
              return res.status(404).json({
                status: 404,
                message:
                  "Votre compte n'est pas encore validé, veuillez vérifier votre boite mail",
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
