import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import Stripe from "stripe";
import { validationBody } from "../../../lib/validation";

export default withIronSessionApiRoute(
  async function get(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        let { start, typeCoaching } = req.body;
        let arrayMessageError = validationBody(req.body);
        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            message: arrayMessageError,
          });
        }
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.meetingId !== null) {
            return res.status(404).json({
              status: 404,
              message: "Vous avez déjà un rendez-vous de pris",
            });
          } else {
            let dateStart = new Date(start);
            let isoDateStart = dateStart.toISOString();
            const meeting = await prisma.meeting.findFirst({
              where: {
                startAt: isoDateStart,
              },
            });
            if (meeting) {
              return res.status(404).json({
                status: 404,
                message: "Ce rendez-vous est déjà pris, veuillez réessayer",
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
                        name: start,
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
              let currentDate = new Date();
              const createMeetingObject: any = {
                startAt: isoDateStart,
                status: false,
                userId: user.id,
                paymentId: copyPaymentId,
                limitDate: new Date(
                  currentDate.setHours(currentDate.getHours() + 1)
                )
                  .getTime()
                  .toString(),
              };
              const createMeeting = await prisma.meeting.create({
                data: createMeetingObject,
              });
              if (createMeeting === null) {
                return res.status(400).json({
                  status: 400,
                  message:
                    "Une erreur est survenue lors de la création du rendez-vous, veuillez réessayer",
                });
              } else {
                let copyTypeMeeting: any = user.typeMeeting;
                const userEdit = await prisma.user.update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    meetingId: createMeeting.id,
                    typeMeeting: {
                      ...copyTypeMeeting,
                      paymentId: copyPaymentId,
                      coaching: typeCoaching,
                    },
                  },
                });
                if (userEdit === null) {
                  return res.status(400).json({
                    status: 400,
                    message:
                      "Une erreur est survenue lors de la création du rendez-vous, veuillez réessayer",
                  });
                } else {
                  res.json({ url: session.url });
                }
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
