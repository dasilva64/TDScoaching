import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";

export default withIronSessionApiRoute(
  async function cancel(req, res) {
    if (req.session.user) {
      let user = await prisma.user.findUnique({
        where: {
          id: req.session.user.id,
        },
      });
      let meetingId = user?.meetingId;
      let editUser = await prisma.user.update({
        where: {
          id: req.session.user.id,
        },
        data: {
          meetingId: null,
        },
      });
      let delMeeting = await prisma.meeting.delete({
        where: {
          id: meetingId!,
        },
      });

      let meeting = await prisma.meeting.findFirst({
        where: {
          id: user?.meetingId!,
        },
      });

      res.status(200).json({
        status: 200,
        message: "Votre rendez-vous a bien été annulé",
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Vous n'êtes pas connecté, veuillez réessayer",
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
