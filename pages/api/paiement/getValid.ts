import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import Stripe from "stripe";

export default withIronSessionApiRoute(
  async function getValid(req, res) {
    if (req.method === "GET") {
      if (req.session.user) {
        let user = await prisma.user.findUnique({
          where: {
            id: req.session.user.id,
          },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.meetingId === null) {
            return res.status(404).json({
              status: 404,
              message: "Vous n'avez pas de rendez-vous, veuillez réessayer",
            });
          } else {
            let meeting = await prisma.meeting.findUnique({
              where: {
                id: user.meetingId,
              },
            });
            if (meeting === null) {
              return res.status(404).json({
                status: 404,
                message: "Le rendez-vous n'existe pas, veuillez réessayer",
              });
            } else {
              let currentDate = new Date();
              if (new Date(Number(meeting.limitDate)) < currentDate) {
                let delMeeting = await prisma.meeting.delete({
                  where: {
                    id: meeting.id,
                  },
                });
                let copyTypeMeeting: any = user.typeMeeting;
                delete copyTypeMeeting["coaching"];
                delete copyTypeMeeting["paymentId"];
                let editUser = await prisma.user.update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    meetingId: null,
                    typeMeeting: {
                      ...copyTypeMeeting,
                    },
                  },
                });
                res.status(404).json({
                  status: 404,
                  message:
                    "Le rendez-vous n'est plus valide, veuillez réessayer",
                });
              } else {
                const stripe = new Stripe(
                  "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f",
                  {
                    apiVersion: "2022-11-15",
                  }
                );
                let price;
                let copyTypeMeeting: any = user.typeMeeting;
                if (copyTypeMeeting.type === "flash") {
                  price = 30000;
                } else if (copyTypeMeeting.type === "longue") {
                  price = 100000;
                } else if (copyTypeMeeting.type === "unique") {
                  price = 10000;
                } else {
                  return res.status(404).json({
                    status: 404,
                    message:
                      "Sélectionnez une formule avant de prendre rendez-vous",
                  });
                }
                let session = await stripe.checkout.sessions.create({
                  line_items: [
                    {
                      price_data: {
                        currency: "eur",
                        product_data: {
                          name: meeting.startAt.toLocaleString(),
                        },

                        unit_amount: price,
                      },

                      quantity: 1,
                    },
                  ],
                  mode: "payment",
                  customer_email: user?.mail,
                  locale: "fr",
                  payment_intent_data: { capture_method: "manual" },
                  success_url: `http://localhost:3000/api/meeting/create`,
                  cancel_url: "http://localhost:3000/rendez-vous",
                });
                let copyPaymentId = session.id;
                const editMeeting = await prisma.meeting.update({
                  where: {
                    id: meeting?.id,
                  },
                  data: {
                    paymentId: copyPaymentId,
                  },
                });
                const userEdit = await prisma.user.update({
                  where: {
                    id: req.session.user.id,
                  },
                  data: {
                    meetingId: meeting.id,
                    typeMeeting: {
                      ...copyTypeMeeting,
                      paymentId: copyPaymentId,
                    },
                  },
                });
                res.json({ url: session.url });
              }
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
