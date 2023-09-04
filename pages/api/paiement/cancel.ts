import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Stripe } from "stripe";

export default withIronSessionApiRoute(
  async function cancel(req, res) {
    if (req.method === "GET") {
      if (req.session.user) {
        console.log(req.session.user);
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
          if (user.meetingId === null) {
            return res.status(404).json({
              status: 404,
              message: "Vous n'avez pas de rendez-vous",
            });
          } else {
            const meeting = await prisma.meeting.findUnique({
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
              let copyTypeMeeting: any = user.typeMeeting;
              if (
                copyTypeMeeting.type === "découverte" ||
                (copyTypeMeeting.type === "flash" &&
                  copyTypeMeeting.number === 3) ||
                (copyTypeMeeting.type === "longue" &&
                  copyTypeMeeting.number === 10)
              ) {
                return res.status(404).json({
                  status: 404,
                  message:
                    "Vous ne pouvez pas supprimer ce rendez-vous, veuillez réessayer",
                });
              } else if (
                (copyTypeMeeting.type === "flash" &&
                  copyTypeMeeting.number > 1) ||
                (copyTypeMeeting.type === "longue" &&
                  copyTypeMeeting.number > 1)
              ) {
                return res.status(404).json({
                  status: 404,
                  message: "En cours de dev",
                });
              } else {
                const stripe = new Stripe(
                  "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f",
                  {
                    apiVersion: "2022-11-15",
                  }
                );
                const session = await stripe.checkout.sessions.retrieve(
                  meeting.paymentId!
                );
                let copyId: any = session.payment_intent;
                const paymentIntent = await stripe.paymentIntents.cancel(
                  copyId
                );
                if (paymentIntent.status === "canceled") {
                  let copyTypeMeeting: any = user.typeMeeting;
                  delete copyTypeMeeting["paymentId"];
                  delete copyTypeMeeting["coaching"];
                  let editUser = await prisma.user.update({
                    where: {
                      id: req.session.user.id,
                    },
                    data: {
                      meetingId: null,
                      typeMeeting: {
                        ...copyTypeMeeting,
                      },
                    },
                  });
                  let delMeeting = await prisma.meeting.delete({
                    where: {
                      id: meeting.id,
                    },
                  });
                  const allMeeting = await prisma.meeting.findMany({
                    where: { startAt: { gte: new Date() } },
                    select: {
                      startAt: true,
                    },
                  });
                  let meetingBody;
                  if (user.meetingId === null) {
                    meetingBody = null;
                  } else {
                    meetingBody = await prisma.meeting.findUnique({
                      where: {
                        id: user.meetingId,
                      },
                    });
                  }
                  let userObject = {
                    meetings: allMeeting,
                    meeting: meetingBody,
                    typeMeeting: editUser.typeMeeting,
                    discovery: editUser.discovery,
                  };
                  return res.status(200).json({
                    status: 200,
                    message: "Le rendez-vous a bien été supprimé",
                    body: userObject,
                  });
                } else {
                  return res.status(404).json({
                    status: 404,
                    message: "Une erreur est survenue, veuillez réessayer",
                  });
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
//cs_test_a1DYstcgths9g3iOwxFdAz8hUJPcpuWygxRYUKvPmGelaJN9X6rnqyORYa
