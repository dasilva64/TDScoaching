import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function getUser(req: any, res: NextApiResponse) {
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
          if (user.role !== "ROLE_ADMIN") {
            return res.status(403).json({
              status: 403,
              message: "Vous n'avez pas accès à cette page, veuillez réessayer",
            });
          } else {
            let allUser = await prisma.user.findMany({
              where: { role: "ROLE_USER" },
              include: {
                Meeting: {
                  select: {
                    id: true,
                  },
                },
              },
            });
            let copyAllUser: any = allUser;
            let allUserObject = [];
            for (let i = 0; i < copyAllUser.length-1; i++) {
              let userObject = {
                id: copyAllUser[i].id,
                mail: copyAllUser[i].email,
                firstName: copyAllUser[i].firstname,
                lastName: copyAllUser[i].lastname,
                phone: copyAllUser[i].phone,
                meeting: copyAllUser[i].meetingId,
                status: copyAllUser[i].status,
              };
              allUserObject.push(userObject);
            }
            res.status(200).json({
              status: 200,
              body: allUserObject,
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
