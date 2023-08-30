import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import Stripe from "stripe";

export default withIronSessionApiRoute(
  async function get(req, res) {
    if (req.session.user) {
      let start = req.body.start;
      let dateStart = new Date(start);
      const meeting = await prisma.meeting.findFirst({
        where: {
          startAt: dateStart,
        },
      });
      if (meeting) {
        return res.status(404).json({
          status: 404,
          message: "Ce rendez-vous est déjà pris, veuillez réessayer",
        });
      } else {
        const user = await prisma.user.findUnique({
          where: {
            id: req.session.user.id,
          },
        });
        let currentDate = new Date();
        const createMeeting: any = {
          startAt: req.body.start,
          endAt: new Date(dateStart.setHours(dateStart.getHours() + 1)),
          status: false,
          userId: req.session.user.id,
          limitDate: new Date(currentDate.setHours(currentDate.getHours() + 1))
            .getTime()
            .toString(),
        };
        const meeting = await prisma.meeting.create({
          data: createMeeting,
        });
        const userEdit = await prisma.user.update({
          where: {
            id: req.session.user.id,
          },
          data: {
            meetingId: meeting.id,
          },
        });
        console.log(req.session.user);

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
                  name:
                    "RDV du " +
                    start.split("T")[0] +
                    " à " +
                    start.split("T")[1].split(":")[0] +
                    "h" +
                    start.split("T")[1].split(":")[1],
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
        let copyPaymentId: string = session.id;
        const editMeeting = await prisma.meeting.update({
          where: {
            id: meeting.id,
          },
          data: {
            paymentId: copyPaymentId,
          },
        });
        res.json({ url: session.url });
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
