import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function getById(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { id } = await req.body;
        const user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          const userById = await prisma.user.findUnique({
            where: { id: id },
            include: {
              Meeting: {
                select: {
                  id: true,
                },
              },
            },
          });
          if (userById === null) {
            return res.status(400).json({
              status: 400,
              message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
            });
          } else {
            const meetingByUser = await prisma.meeting.findMany({
              where: { userId: id },
            });
            let userObject = {
              id: userById?.id,
              role: userById?.role,
              firstname: userById?.firstname,
              lastname: userById?.lastname,
              mail: userById?.mail,
              status: userById?.status,
              phone: userById?.phone,
              editEmail: userById?.editEmail,
              editPhone: userById?.editPhone,
              twoFactor: userById?.twoFactor,
              twoFactorCode: userById?.twoFactorCode,
              allMeetings: meetingByUser,
              meeting: userById.meetingId,
            };
            return res.status(200).json({
              status: 200,
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