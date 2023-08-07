import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Stripe } from "stripe";

export default withIronSessionApiRoute(
  async function cancel(req, res) {
    if (req.session.user) {
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
        let meetingId = user?.meetingId;
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
            id: req.session.user.id,
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

        let userEditMailObject;
        if (user.editEmail) {
          let copyEditEmail: any = user.editEmail;
          let limitDate = copyEditEmail.limitDate;
          let convertInDate = new Date(limitDate);
          if (convertInDate < new Date()) {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                editEmail: Prisma.JsonNull,
              },
            });
            userEditMailObject = null;
          } else {
            userEditMailObject = {
              newEmail: copyEditEmail.newEmail,
              limitDate: copyEditEmail.limitDate,
            };
          }
        } else {
          userEditMailObject = null;
        }

        let userEditPhoneObject;
        if (user.editPhone) {
          let copyEditPhone: any = user.editPhone;
          let limitDate = copyEditPhone.limitDate;
          let convertInDate = new Date(limitDate);
          if (convertInDate < new Date()) {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                editPhone: Prisma.JsonNull,
              },
            });
            userEditPhoneObject = null;
          } else {
            userEditPhoneObject = {
              newPhone: copyEditPhone.newPhone,
              limitDate: copyEditPhone.limitDate,
            };
          }
        } else {
          userEditPhoneObject = null;
        }
        let userTwoFactorObject;
        if (user.twoFactorCode) {
          let copyTwoFactorCode: any = user.twoFactorCode;
          let limitDate = copyTwoFactorCode.limitDate;
          let convertInDate = new Date(limitDate);
          if (convertInDate < new Date()) {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                twoFactorCode: Prisma.JsonNull,
              },
            });
            userTwoFactorObject = null;
          } else {
            userTwoFactorObject = {
              limitDate: copyTwoFactorCode.limitDate,
            };
          }
        } else {
          userTwoFactorObject = null;
        }
        const allMeeting = await prisma.meeting.findMany({
          where: { startAt: { gte: new Date() } },
          include: {
            User: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        });
        if (user.meetingId !== null) {
          let meeting = await prisma.meeting.findUnique({
            where: {
              id: user.meetingId,
            },
          });
          let userObject = {
            id: user.id,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.mail,
            meeting: meeting,
            meetings: allMeeting,
            phone: user.phone,
            editEmail: userEditMailObject,
            editPhone: userEditPhoneObject,
            twoFactor: user.twoFactor,
            twoFactorCode: userTwoFactorObject,
          };
          return res.status(200).json({
            status: 200,
            message: "Votre rendez-vous a bien été annulé",
            body: userObject,
          });
        } else {
          let userObject = {
            id: user.id,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.mail,
            meeting: user.meetingId,
            meetings: allMeeting,
            phone: user.phone,
            editEmail: userEditMailObject,
            editPhone: userEditPhoneObject,
            twoFactor: user.twoFactor,
            twoFactorCode: userTwoFactorObject,
          };
          return res.status(200).json({
            status: 200,
            body: userObject,
            message: "Votre rendez-vous a bien été annulé",
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
