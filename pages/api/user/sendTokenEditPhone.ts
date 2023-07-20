import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import twilio from "twilio";

export default withIronSessionApiRoute(
  async function sendTokenEditPhone(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        
        const { phone } = await req.body;
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });

        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez rézssayer",
          });
        } else {
          
          if (user.phone === phone) {
            return res.status(404).json({
              status: 404,
              message:
                "Vous ne pouvez pas utiliser le même numéro veuillez réessayer",
            });
          }
          
          let userNew = await prisma.user.findFirst({
            where: { phone: phone },
          });
          if (userNew === null) {
            let min = Math.ceil(10000000);
            let max = Math.floor(99999998);
            let random = Math.floor(Math.random() * (max - min + 1)) + min;
            let current = new Date();
            let editUser = await prisma.user.update({
              where: { phone: user.phone },
              data: {
                editPhone: {
                  token: random,
                  newPhone: phone,
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

            let copyEditPhone: any = editUser.editPhone;
            let userObject = {
              id: editUser.id,
              role: editUser.role,
              firstname: editUser.firstname,
              lastname: editUser.lastname,
              email: editUser.mail,
              phone: editUser.phone,
              editEmail: editUser.editEmail,
              editPhone: {
                newPhone: copyEditPhone.newPhone,
                limitDate: copyEditPhone.limitDate,
              },
            };
            res.status(200).json({
              status: 200,
              body: userObject,
              message:
                "Un message vous a été envoyer pour valider votre nouveau numéro de téléphone",
            });
          } else {
            return res.status(404).json({
              status: 404,
              message:
                "Un utilisateur utilise déjà cette adresse mail, veuillez réessayer",
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
