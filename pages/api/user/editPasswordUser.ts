import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default withIronSessionApiRoute(
  async function editPasswordUser(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { password } = await req.body;

        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          const encrytpPassword = async () => {
            const saltRounds = 10;
            let encrypt = await bcrypt.hash(password, saltRounds);

            let editUser = await prisma.user.update({
              where: { mail: user?.mail },
              data: { password: encrypt },
            });
            res.status(200).json({
              status: 200,
              message: "Votre mot de passe a été modifié avec succès",
            });
          };
          encrytpPassword();
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