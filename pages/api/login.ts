import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

export async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  console.log("jkslfdjklsdf");
  if (req.method === "POST") {
    const { mail, password } = await req.body;
    const user = await prisma.user.findFirst({
      where: {
        mail: mail,
      },
    });
    console.log(user);
    if (user) {
      const decode = await bcrypt.compare(password, user.password);
      console.log(decode);
      if (decode === false) {
        return res.status(404).json({
          status: 404,
          body: { message: "Not found" },
        });
      } else {
        req.session.user = user;
        await req.session.save();
        return res.status(200).json({
          status: 200,
          body: user,
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        body: { message: "Not found" },
      });
    }
  } else {
    res.status(404).json({
      status: 404,
      body: { message: "Not found" },
    });
  }
}
export default withIronSessionApiRoute(loginRoute, sessionOptions);
