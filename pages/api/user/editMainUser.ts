import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";

export default withIronSessionApiRoute(
  async function editMainUser(req, res) {
    if (req.session.user) {
      const { firstname, lastname } = await req.body;
      let user = await prisma.user.findUnique({
        where: { id: req.session.user.id },
      });
      if (user === null) {
        return res.status(400).json({
          status: 400,
          message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
        });
      } else {
        let editUser = await prisma.user.update({
          where: {
            id: req.session.user.id,
          },
          data: { firstname: firstname, lastname: lastname },
          include: { meetings: true },
        });
        console.log(editUser);
        let userObject = {
          id: editUser.id,
          firstname: editUser.firstname,
          lastname: editUser.lastname,
          email: editUser.mail,
          role: editUser.role,
          meetings: editUser.meetings,
          phone: editUser.phone,
        };
        res.status(200).json({
          status: 200,
          message: "Vos informations ont été mis à jours avec succès",
          body: userObject,
        });
      }
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
