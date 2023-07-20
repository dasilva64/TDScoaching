import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default withIronSessionApiRoute(
  async function getuser(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      if (req.session.user) {
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(404).json({
            status: 404,
            message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
          });
        } else {
          const meeting = await prisma.meeting.findUnique({
            where: { id: user.meetingId! },
          });
          if (meeting === null) {
            return res.status(404).json({
              status: 404,
              message: "Aucun rendez-vous existe avec cet id",
            });
          } else {
            const {description} = await req.body;
            const editMetting = await prisma.meeting.update({
              where: { id: meeting.id },
              data: { description: description },
            });
            return res.status(200).json({
              status: 200,
              message: "Votre description a été modifié avec succès",
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
