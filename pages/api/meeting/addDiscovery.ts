import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { validationBody } from "../../../lib/validation";

export default withIronSessionApiRoute(
  async function addFirst(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        let { start, typeCoaching } = req.body;
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
          if (user.meetingId !== null) {
            return res.status(404).json({
              status: 404,
              message: "Vous avez déjà un rendez-vous de pris",
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
              const createMeetingObject: any = {
                startAt: isoDateStart,
                status: true,
                userId: req.session.user.id,
                limitDate: null,
                paymentId: null,
              };
              const createMeeting = await prisma.meeting.create({
                data: createMeetingObject,
              });
              if (createMeeting === null) {
                return res.status(400).json({
                  status: 400,
                  message:
                    "Une erreur est survenue lors de la création du rendez-vous, veuillez réessayer",
                });
              } else {
                let copyTypeMeeting: any = user.typeMeeting;
                const userEdit = await prisma.user.update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    meetingId: createMeeting.id,
                    typeMeeting: {
                      ...copyTypeMeeting,
                      coaching: typeCoaching,
                    },
                  },
                });

                if (userEdit === null) {
                  return res.status(400).json({
                    status: 400,
                    message:
                      "Une erreur est survenue lors de la création du rendez-vous, veuillez réessayer",
                  });
                } else {
                  const allMeeting = await prisma.meeting.findMany({
                    where: { startAt: { gte: new Date() } },
                    select: {
                      startAt: true,
                    },
                  });
                  let userObject = {
                    meeting: createMeeting,
                    meetings: allMeeting,
                    discovery: userEdit.discovery,
                    typeMeeting: userEdit.typeMeeting,
                  };
                  return res.status(200).json({
                    status: 200,
                    message: "Rendez-vous pris avec succès",
                    body: userObject,
                    start: start,
                    new: dateStart,
                    iso: isoDateStart,
                    after: createMeeting.startAt,
                  });
                }
              }
            }
          }
        }
      } else {
        return res.status(401).json({
          status: 401,
          message: "Vous n'êtes pas connecté",
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
