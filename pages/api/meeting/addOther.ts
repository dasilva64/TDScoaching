import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function addOther(req, res) {
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
        const createMeeting: any = {
          startAt: req.body.start,
          endAt: new Date(dateStart.setHours(dateStart.getHours() + 1)),
          status: true,
          userId: req.session.user.id,
          limitDate: null,
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
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user) {
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
              message: "Rendez-vous pris avec succès",
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
              editEmail: userEditMailObject,
              twoFactor: user.twoFactor,
              twoFactorCode: userTwoFactorObject,
              typeMeeting: user.typeMeeting,
              discovery: user.discovery,
            };
            return res.status(200).json({
              status: 200,
              message: "Rendez-vous pris avec succès",
              body: userObject,
            });
          }
        }
        return res.status(400).json({
          status: 400,
          message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
        });
      }
    } else {
      return res.status(401).json({
        status: 401,
        message: "Vous n'êtes pas connecté",
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
