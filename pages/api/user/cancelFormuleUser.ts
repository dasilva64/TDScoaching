import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";
import validator from "validator";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function cancelFormuleUser(req, res) {
    if (req.method === "GET") {
      if (req.session.user) {
        let arrayMessageError = validationBody(req.body);
        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            message: arrayMessageError,
          });
        }
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          const deleteFormule = await prisma.user.update({
            where: {
              id: req.session.user.id,
            },
            data: {
              typeMeeting: { type: "découverte" },
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
              editEmail: userEditMailObject,
              twoFactor: user.twoFactor,
              twoFactorCode: userTwoFactorObject,
              discovery: user.discovery,
              typeMeeting: user.typeMeeting,
            };
            return res.status(200).json({
              status: 200,
              body: userObject,
              message: "Votre formule a été annulé avec succès",
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
              editEmail: userEditMailObject,
              twoFactor: user.twoFactor,
              twoFactorCode: userTwoFactorObject,
              discovery: user.discovery,
              typeMeeting: user.typeMeeting,
            };
            return res.status(200).json({
              status: 200,
              message: "Votre formule a été annulé avec succès",
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
