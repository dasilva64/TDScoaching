import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function getuser(req: any, res: NextApiResponse) {
    if (req.method === "GET") {
      if (req.session.user) {
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          const { start } = await req.body;
          if (user.role === "ROLE_ADMIN") {
            const meeting = await prisma.meeting.findFirst({
              where: { startAt: start },
            });
            const deleteMeeting = await prisma.meeting.delete({
              where: { id: meeting?.id },
            });
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

            return res.status(200).json({
              status: 200,
              message: "Rendez-vous supprimé avec succès",
              body: allMeeting,
            });
          } else {
            if (user.meetingId) {
              const meeting = await prisma.meeting.findUnique({
                where: { id: user.meetingId },
              });
              let meetingId = meeting?.id;
              const deleteMeetingInUser = await prisma.user.update({
                where: { id: user.id },
                data: { meetingId: null },
              });
              const deleteMeeting = await prisma.meeting.delete({
                where: { id: meetingId },
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
                  birth: user.birth,
                  genre: user.genre,
                  discovery: user.discovery,
                };
                return res.status(200).json({
                  status: 200,
                  message: "Rendez-vous supprimé avec succès",
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
                  birth: user.birth,
                  genre: user.genre,
                  discovery: user.discovery,
                };
                return res.status(200).json({
                  status: 200,
                  message: "Rendez-vous supprimé avec succès",
                  body: userObject,
                });
              }
            } else {
              return res.status(400).json({
                status: 400,
                message:
                  "Le rendez-vous n'a pas été trouvé, veuillez réessayer",
              });
            }
          }
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        });
      }
      /* const deleteMeetingInUser = await prisma.user.update({
        where: { meetingId: id },
        data: { meetingId: Prisma.JsonNull },
      });
      if (1 === 1) {
        const deleteMeet = await prisma.meeting.delete({ where: { id: id } });
        const getUser = await prisma.user.findUnique({
          where: { mail: req.auth.user },
          include: { meetings: true },
        });
        if (getUser === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          res.status(200).json({
            status: 200,
            user: getUser,
            message: "Rendez-vous supprimé avec succès",
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Le rendez-vous n'a pas été modifié, veuillez réessayer",
        });
      } */
    } else {
      return res.status(404).json({
        status: 404,
        message: "bad request",
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
