import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import validator from "validator";

export default withIronSessionApiRoute(
  async function deleteAccount(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { token } = await req.body;
        if (token && validator.escape(token.trim()).length > 0) {
          const { verify } = jwt;
          const decodeToken: any = verify(
            validator.escape(token.trim()),
            process.env.SECRET_TOKEN_DELETE as string
          );
          let user = await prisma.user.findUnique({
            where: { mail: decodeToken.user },
          });
          if (user === null) {
            return res.status(404).json({
              status: 404,
              message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
            });
          } else {
            if (user.deleteToken && user.status === true) {
              let copyDeleteToken: any = user?.deleteToken;
              if (validator.escape(token.trim()) === copyDeleteToken.token) {
                if (new Date().getTime() > copyDeleteToken.limitDate) {
                  const deleteToken = await prisma.user.update({
                    where: { id: user.id },
                    data: { deleteToken: Prisma.JsonNull },
                  });
                  return res.status(404).json({
                    status: 404,
                    message:
                      "Le lien de suppression de votre compte est plus valide, veuillez réessayer",
                  });
                } else {
                  if (user.meetingId !== null) {
                    return res.status(404).json({
                      status: 404,
                      message:
                        "Vous ne pouvez pas supprimer votre compte car vous avez un rendez-vous de prévu",
                    });
                  } else {
                    const deleteUser = await prisma.user.delete({
                      where: { id: user.id },
                    });
                    req.session.destroy();
                    return res.status(200).json({
                      status: 200,
                      message: "Votre compte a bien été supprimé",
                    });
                  }
                }
              } else {
                return res.status(404).json({
                  status: 404,
                  message: "Le token n'est pas valide, veuillez réessayer",
                  body: user,
                });
              }
            } else {
              res.status(404).json({
                status: 404,
                message:
                  "Le lien de suppression de votre compte est plus valide, veuillez réessayer",
              });
            }
          }
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
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
