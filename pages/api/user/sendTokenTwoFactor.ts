import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import twilio from "twilio";

export default withIronSessionApiRoute(
  async function sendTokenTwoFactor(req, res) {
    if (req.method === "GET") {
      if (req.session.user) {
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          let min = Math.ceil(10000000);
          let max = Math.floor(99999998);
          let random = Math.floor(Math.random() * (max - min + 1)) + min;
          let current = new Date();
          let editUser = await prisma.user.update({
            where: {
              id: req.session.user.id,
            },
            data: {
              twoFactorCode: {
                token: random,
                limitDate: current.setMinutes(current.getMinutes() + 5),
              },
            },
          });
          const verifySid = "VA20ccd8e069732b219c3798beda84b750";
          const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
          );
          const test = await client.messages.create({
            body: `Votre code de vérification est ${random}`,

            from: "+1 361 314 4154",
            to: `+33686381081`,
          });
          let copyTwoFactorCode: any = editUser.twoFactorCode;
          let userObject = {
            id: editUser.id,
            firstname: editUser.firstname,
            lastname: editUser.lastname,
            email: editUser.mail,
            role: editUser.role,
            phone: editUser.phone,
            twoFactorCode: { limitDate: copyTwoFactorCode.limitDate },
          };
          res.status(200).json({
            status: 200,
            message: "Un code de vérification vous a été envoyé par SMS",
            body: userObject,
          });
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
