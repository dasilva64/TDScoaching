import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import twilio from "twilio";

export default withIronSessionApiRoute(
  async function phoneReSendCode(req, res) {
    if (req.method === "GET") {
      if (req.session.user) {
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.editPhone) {
            let min = Math.ceil(10000000);
            let max = Math.floor(99999998);
            let random = Math.floor(Math.random() * (max - min + 1)) + min;
            let current = new Date();
            let copyEditPhone: any = user.editPhone;
            let editUser = await prisma.user.update({
              where: { phone: user.phone },
              data: {
                editPhone: {
                  token: random,
                  newPhone: copyEditPhone.newPhone,
                  limitDate: current.setMinutes(current.getMinutes() + 5),
                },
              },
            });
            const verifySid = "VA20ccd8e069732b219c3798beda84b750";
            const client = twilio(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            );
            await client.messages.create({
              body: `Votre code de vérification est ${random}`,

              from: "+1 361 314 4154",
              to: `+33661861227`,
            });
            return res.json({
              status: 200,
              body: editUser,
              message:
                "Un code vous à été renvoyer pour valider votre numéro de téléphone",
            });
          } else {
            return res.json({
              status: 400,
              message:
                "Aucune modification de numéro de téléphone en cours, veuillez réessayer",
            });
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
