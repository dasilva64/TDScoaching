import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import twilio from "twilio";
import { validationBody } from "../../../lib/validation";
import validator from "validator";

export default withIronSessionApiRoute(
  async function sendTokenEditPhone(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { phone, pseudo } = await req.body;
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
              "Une erreur est survenue lors de l'envoie du message, veuillez réessayer plus tard",
          });
        } else {
          let user = await prisma.user.findUnique({
            where: { id: req.session.user.id },
          });

          if (user === null) {
            return res.status(404).json({
              status: 404,
              message: "L'utilisateur n'a pas été trouvé, veuillez rézssayer",
            });
          } else {
            if (user.phone === validator.escape(phone.trim())) {
              return res.status(404).json({
                status: 404,
                message:
                  "Vous ne pouvez pas utiliser le même numéro veuillez réessayer",
              });
            }

            let userNew = await prisma.user.findFirst({
              where: { phone: validator.escape(phone.trim()) },
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
                    newPhone: validator.escape(phone.trim()),
                    limitDate: current.setMinutes(current.getMinutes() + 5),
                  },
                },
              });

              const client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
              );
              const sendCodePhone = await client.messages.create({
                body: `Votre code de vérification est ${random}`,

                from: "+1 864 527 8328",
                to: `+33661861227`,
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
