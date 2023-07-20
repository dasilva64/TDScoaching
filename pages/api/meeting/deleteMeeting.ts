import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default withIronSessionApiRoute(
  async function getuser(req: any, res: NextApiResponse) {
    if (req.method === "POST") {
      let id = req.params.id;
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
