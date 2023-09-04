import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Stripe } from "stripe";
import { validationBody } from "../../../lib/validation";
import edit from "../meeting/edit";

export default withIronSessionApiRoute(
  async function accept(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { userId } = await req.body;
        if (userId === null || userId === undefined) {
          return res.status(400).json({
            status: 400,
            message: "L'id de la requête n'est pas valide, veuillez réessayer",
          });
        }
        let arrayMessageError = validationBody(req.body);
        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            message: arrayMessageError,
          });
        }
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
          if (user.role !== "ROLE_ADMIN") {
            return res.status(400).json({
              status: 400,
              message: "Vous n'avez pas les droits pour accéder à cette page",
            });
          } else {
            let userById = await prisma.user.findUnique({
              where: {
                id: userId,
              },
            });
            if (userById === null) {
              return res.status(400).json({
                status: 400,
                message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
              });
            } else {
              if (userById.meetingId === null) {
                return res.status(400).json({
                  status: 400,
                  message:
                    "Le rendez-vous n'as pas été trouvé, veuillez réessayer",
                });
              } else {
                const meeting = await prisma.meeting.findUnique({
                  where: {
                    id: userById.meetingId,
                  },
                });
                if (meeting === null) {
                  return res.status(400).json({
                    status: 400,
                    message: "Le rendez-vous n'existe pas, veuillez réessayer",
                  });
                } else {
                  let copyTypeMeeting: any = userById.typeMeeting;
                  const stripe = new Stripe(
                    "sk_test_51J9UwTBp4Rgye6f3R2h9T8ANw2bHyxrCUCAmirPjmEsTV0UETstCh93THc8FmDhNyDKvbtOBh1fxAu4Y8kSs2pwl00W9fP745f",
                    {
                      apiVersion: "2022-11-15",
                    }
                  );

                  let editUser;
                  if (
                    (copyTypeMeeting.type === "flash" &&
                      copyTypeMeeting.number === 1) ||
                    (copyTypeMeeting.type === "longue" &&
                      copyTypeMeeting.number === 1) ||
                    copyTypeMeeting.type === "unique"
                  ) {
                    const session = await stripe.checkout.sessions.retrieve(
                      copyTypeMeeting.paymentId
                    );
                    let copyId: any = session.payment_intent;
                    const paymentIntent = await stripe.paymentIntents.capture(
                      copyId
                    );
                    if (paymentIntent.status === "succeeded") {
                      editUser = await prisma.user.update({
                        where: {
                          id: meeting.userId,
                        },
                        data: {
                          meetingId: null,
                          typeMeeting: {
                            type: "découverte",
                          },
                        },
                      });
                      if (editUser === null) {
                        return res.status(400).json({
                          status: 400,
                          message:
                            "L'utilisateur n'as pas pu être modifié, veuillez réessayer",
                        });
                      } else {
                        const meetingByUser = await prisma.meeting.findMany({
                          where: { userId: userById.id },
                          select: {
                            startAt: true,
                            status: true,
                          },
                        });
                        let userObject = {
                          id: editUser.id,
                          firstname: editUser.firstname,
                          lastname: editUser.lastname,
                          mail: editUser.mail,
                          discovery: editUser.discovery,
                          allMeetings: meetingByUser,
                          meeting: editUser.meetingId,
                          typeMeeting: editUser.typeMeeting,
                        };
                        return res.status(200).json({
                          status: 200,
                          message: "Votre rendez-vous a bien été accepté",
                          body: userObject,
                        });
                      }
                    } else {
                      return res.status(400).json({
                        status: 400,
                        message: "Votre paiement n'as pas été effectué",
                      });
                    }
                  }
                  return res.status(404).json({
                    status: 404,
                    message:
                      "Vous ne pouvez pas supprimer ce rendez-vous, veuillez réessayer",
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
