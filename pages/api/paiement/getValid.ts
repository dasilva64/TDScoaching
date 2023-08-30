import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import Stripe from "stripe";

export default withIronSessionApiRoute(
  async function getValid(req, res) {
    if (req.session.user) {
      let user = await prisma.user.findUnique({
        where: {
          id: req.session.user.id,
        },
      });
      let meeting = await prisma.meeting.findUnique({
        where: {
          id: user?.meetingId!,
        },
      });
      if (meeting === null) {
        return res.status(404).json({
          status: 404,
          message: "Le rendez-vous n'existe pas, veuillez réessayer",
        });
      } else {
        let currentDate = new Date();
        if (new Date(Number(meeting?.limitDate)) < currentDate) {
          let delMeeting = await prisma.meeting.delete({
            where: {
              id: meeting?.id,
            },
          });
          res.status(404).json({
            status: 404,
            message: "Le rendez-vous n'est plus valide, veuillez réessayer",
          });
        } else {
          /* let editMeeting = await prisma.meeting.update({
            where: {
              id: meeting?.id,
            },
            data: {
              status: true,
              limitDate: null,
            },
          }); */
          const stripe = new Stripe(
            "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f",
            {
              apiVersion: "2022-11-15",
            }
          );

          const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: "eur",
                  product_data: {
                    name: "RDV du ",
                  },
                  unit_amount: 10000,
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
          res.json({ url: session.url });
        }
      }
    } else {
      return res.status(404).json({
        status: 404,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
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
