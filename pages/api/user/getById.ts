import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import { validationBody } from "../../../lib/validation";

export default withIronSessionApiRoute(
  async function getById(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { id } = await req.body;
        let arrayMessageError = validationBody(req.body);
        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            type: "validation",
            message: arrayMessageError,
          });
        }
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message:
              "L'utilisateur utilisant cette session n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          if (user.role !== "ROLE_ADMIN") {
            return res.status(403).json({
              status: 403,
              message: "Vous n'avez pas les droits pour accéder à cette page",
            });
          } else {
            const userById = await prisma.user.findUnique({
              where: { id: id },
            });
            if (userById === null) {
              return res.status(404).json({
                status: 404,
                message: `L'utilisateur avec l'id : ${id} n'a pas été trouvé, veuillez réessayer`,
              });
            } else {
              let meeting;
              if (userById.meetingId === null) {
                meeting = null;
              } else {
                let meetingByUser = await prisma.meeting.findUnique({
                  where: { id: userById.meetingId },
                });
                if (meetingByUser === null) {
                  let editUser = await prisma.user.update({
                    where: {
                      id: userById.id,
                      status: true,
                    },
                    data: {
                      meetingId: null,
                    },
                  });
                  meeting = null;
                } else {
                  meeting = meetingByUser;
                }
              }
              const meetingByUser = await prisma.meeting.findMany({
                where: { userId: userById.id },
                select: {
                  startAt: true,
                  typeMeeting: true,
                },
              });
              let userObject = {
                id: userById.id,
                firstname: userById.firstname,
                lastname: userById.lastname,
                mail: userById.mail,
                discovery: userById.discovery,
                allMeetings: meetingByUser,
                meeting: meeting,
                typeMeeting: userById.typeMeeting,
              };
              return res.status(200).json({
                status: 200,
                body: userObject,
              });
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
      return res.status(405).json({
        status: 405,
        message:
          "La méthode de la requête n'est pas autorisé, veuillez réessayer",
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
