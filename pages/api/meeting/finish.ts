import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";

export default withIronSessionApiRoute(
  async function get(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { id } = await req.body;
        if (id === undefined) {
          return res.status(400).json({
            status: 400,
            message: "L'id de la requête est introuvable, veuillez réessayer",
          });
        }
        if (req.body === undefined) {
          return res.status(400).json({
            status: 400,
            message: "Une erreur est survenue, veuillez réessayer",
          });
        }
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
            const userById = await prisma.user.findUnique({
              where: { id: id },
            });
            if (userById === null) {
              return res.status(400).json({
                status: 400,
                message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
              });
            } else {
              if (userById.meetingId === null) {
                return res.status(404).json({
                  status: 404,
                  message: "L'utilisateur n'a pas de rendez-vous",
                });
              } else {
                let copyTypeMeeting: any = user.typeMeeting;
                delete copyTypeMeeting["coaching"];
                const userByIdDeleteMeeting = await prisma.user.update({
                  where: { id: userById.id },
                  data: {
                    meetingId: null,
                    discovery: true,
                    typeMeeting: {
                      ...copyTypeMeeting,
                    },
                  },
                });
                if (userByIdDeleteMeeting === null) {
                  return res.status(404).json({
                    status: 404,
                    message:
                      "Le rendez-vous n'as pas être terminé, veuillez réessayer",
                  });
                } else {
                  const meetingByUser = await prisma.meeting.findMany({
                    where: { userId: userById.id },
                    select: {
                      startAt: true,
                      typeMeeting: true,
                    },
                  });
                  let userObject = {
                    id: userById.id,
                    firstname: userByIdDeleteMeeting.firstname,
                    lastname: userByIdDeleteMeeting.lastname,
                    mail: userByIdDeleteMeeting.mail,
                    discovery: userByIdDeleteMeeting.discovery,
                    allMeetings: meetingByUser,
                    meeting: userByIdDeleteMeeting.meetingId,
                    typeMeeting: userByIdDeleteMeeting.typeMeeting,
                  };

                  return res.status(200).json({
                    status: 200,
                    message: "Rendez-vous terminé avec succès",
                    body: userObject,
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
