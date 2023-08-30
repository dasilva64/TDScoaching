import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Stripe } from "stripe";

export default withIronSessionApiRoute(
  async function cancel(req, res) {
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
        const paymentIntent = await stripe.paymentIntents.cancel(copyId);

        let editUser = await prisma.user.update({
          where: {
            id: meeting?.userId,
          },
          data: {
            meetingId: null,
          },
        });
        let delMeeting = await prisma.meeting.delete({
          where: {
            id: meeting?.id,
          },
        });
        const userById = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (userById === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          const meetingByUser = await prisma.meeting.findMany({
            where: { userId: userId },
            select: {
              startAt: true,
              status: true,
            },
          });
          let userObject = {
            id: userById?.id,
            role: userById?.role,
            firstname: userById?.firstname,
            lastname: userById?.lastname,
            mail: userById?.mail,
            status: userById?.status,
            phone: userById?.phone,
            editEmail: userById?.editEmail,
            editPhone: userById?.editPhone,
            twoFactor: userById?.twoFactor,
            twoFactorCode: userById?.twoFactorCode,
            allMeetings: meetingByUser,
            meeting: null,
            birth: userById.birth,
            genre: userById.genre,
            discovery: userById.discovery,
            typeMeeting: userById.typeMeeting,
          };
          return res.status(200).json({
            status: 200,
            message: "Votre rendez-vous a bien été annulé",
            body: userObject,
          });
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
//cs_test_a1DYstcgths9g3iOwxFdAz8hUJPcpuWygxRYUKvPmGelaJN9X6rnqyORYa
