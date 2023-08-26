import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Stripe } from "stripe";

export default withIronSessionApiRoute(
  async function accept(req, res) {
    if (req.session.user) {
      const { userId, meetingId } = await req.body;
      let user = await prisma.user.findUnique({
        where: {
          id: req.session.user.id,
        },
      });
      if (user === null) {
        return res.status(404).json({
          status: 404,
          message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
        });
      } else {
        const meeting = await prisma.meeting.findUnique({
          where: {
            id: meetingId!,
          },
        });

        const stripe = new Stripe(
          "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f",
          {
            apiVersion: "2022-11-15",
          }
        );
        const session = await stripe.checkout.sessions.retrieve(
          meeting?.paymentId!
        );
        let copyId: any = session.payment_intent;
        const paymentIntent = await stripe.paymentIntents.capture(copyId);
        return res.status(200).json({
          status: 200,
          message: "Votre rendez-vous a bien été accepté",
        });
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
