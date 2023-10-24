import { NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function getAll(req: any, res: NextApiResponse) {
    if (req.method === "GET") {
      if (req.session.user) {
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
              message: "Vous n'avez pas accès à cette page, veuillez réessayer",
            });
          } else {
            let allUser = await prisma.user.findMany({
              where: { role: "ROLE_USER" },
              include: {
                Meeting: {
                  select: {
                    id: true,
                    startAt: true,
                  },
                },
              },
            });
            let copyAllUser: any = allUser;
            let allUserObject = [];
            for (let i = 0; i < copyAllUser.length; i++) {
              let userObject = {
                id: copyAllUser[i].id,
                mail: copyAllUser[i].mail,
                firstName: copyAllUser[i].firstname,
                lastName: copyAllUser[i].lastname,
                phone: copyAllUser[i].phone,
                allMeeting: copyAllUser[i].Meeting,
                idMeeting: copyAllUser[i].meetingId,
              };
              allUserObject.push(userObject);
            }

            return res.status(200).json({
              status: 200,
              body: allUserObject,
            });
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
