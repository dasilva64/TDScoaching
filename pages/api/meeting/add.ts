import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function get(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        let { start, userId } = req.body;
        let arrayMessageError = validationBody(req.body);
        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            message: arrayMessageError,
          });
        }
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.role !== "ROLE_ADMIN") {
            return res.status(400).json({
              status: 400,
              message: "Vous n'avez pas les droits pour accéder à cette page",
            });
          } else {
            let dateStart = new Date(start);
            let isoDateStart = dateStart.toISOString();

            const meeting = await prisma.meeting.findFirst({
              where: {
                startAt: isoDateStart,
              },
            });
            if (meeting) {
              return res.status(404).json({
                status: 404,
                message: "Ce rendez-vous est déjà pris, veuillez réessayer",
              });
            } else {
              if (userId) {
                let user = await prisma.user.findFirst({
                  where: { id: userId },
                });
                if (user === null) {
                  return res.status(404).json({
                    status: 404,
                    message:
                      "L'utilisateur n'as pas été trouvé, veuillez réessayer",
                  });
                } else {
                  const createMeetingObject: any = {
                    startAt: isoDateStart,
                    status: true,
                    userId: userId,
                    limitDate: null,
                    typeMeeting: Prisma.JsonNull,
                  };
                  const meetingCreate = await prisma.meeting.create({
                    data: createMeetingObject,
                  });
                  if (meetingCreate === null) {
                    return res.status(404).json({
                      status: 404,
                      message:
                        "Le rendez-vous ne peut pas être créé, veuillez réessayer",
                    });
                  } else {
                    let copyTypeMeeting: any = user?.typeMeeting;
                    if (copyTypeMeeting.type !== "unique") {
                      if (copyTypeMeeting.number > 1) {
                        copyTypeMeeting.number = copyTypeMeeting.number - 1;
                        const userEdit = await prisma.user.update({
                          where: { id: userId },
                          data: {
                            meetingId: meetingCreate.id,
                            typeMeeting: copyTypeMeeting,
                          },
                        });
                        const editMeeting = await prisma.meeting.update({
                          where: { id: meetingCreate.id },
                          data: {
                            typeMeeting: copyTypeMeeting,
                          },
                        });
                        const allMeeting = await prisma.meeting.findMany({
                          where: { startAt: { gte: new Date() } },
                          include: {
                            User: {
                              select: {
                                firstname: true,
                                lastname: true,
                              },
                            },
                          },
                        });
                        let copyAllMeeting: any = allMeeting;
                        let array: any = [];
                        for (let i = 0; i < allMeeting.length; i++) {
                          delete copyAllMeeting[i].paymentId;
                          delete copyAllMeeting[i].limitDate;
                          delete copyAllMeeting[i].id;
                          delete copyAllMeeting[i].status;
                          array.push(copyAllMeeting[i]);
                        }
                        return res.status(200).json({
                          status: 200,
                          body: array,
                          message: "Rendez-vous pris avec succès",
                        });
                      } else {
                        return res.status(404).json({
                          status: 404,
                          message:
                            "Le client n'as plus de rendez-vous à ajouter, veuillez réessayer",
                        });
                      }
                    } else {
                      return res.status(404).json({
                        status: 404,
                        message:
                          "La formule du client ne correspond pas, veuillez réessayer",
                      });
                    }
                  }
                }
              } else {
                const createMeeting: any = {
                  startAt: isoDateStart,
                  status: true,
                  userId: user.id,
                  limitDate: null,
                };
                const meetingCreate = await prisma.meeting.create({
                  data: createMeeting,
                });
                if (meetingCreate === null) {
                  return res.status(404).json({
                    status: 404,
                    message:
                      "Le rendez-vous ne peut pas être créé, veuillez réessayer",
                  });
                } else {
                  const allMeeting = await prisma.meeting.findMany({
                    where: { startAt: { gte: new Date() } },
                    include: {
                      User: {
                        select: {
                          firstname: true,
                          lastname: true,
                        },
                      },
                    },
                  });
                  let copyAllMeeting: any = allMeeting;
                  let array: any = [];
                  for (let i = 0; i < allMeeting.length; i++) {
                    delete copyAllMeeting[i].paymentId;
                    delete copyAllMeeting[i].limitDate;
                    delete copyAllMeeting[i].id;
                    delete copyAllMeeting[i].status;
                    array.push(copyAllMeeting[i]);
                  }
                  return res.status(200).json({
                    status: 200,
                    body: array,
                    message: "Rendez-vous pris avec succès",
                  });
                }
              }
            }
          }
        }
      } else {
        return res.status(401).json({
          status: 401,
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
