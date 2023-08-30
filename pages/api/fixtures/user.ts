import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function sendTokenEditPhone(req: any, res: any) {
  for (let i = 15; i < 1000; i++) {
    let encrypt = await bcrypt.hash("password", 10);
    let UserCreate = await prisma.user.create({
      data: {
        mail: "mail" + i + "@gmail.com",
        firstname: "firstname" + i,
        lastname: "lastname" + i,
        password: encrypt,
        status: true,
        phone: i.toString(),
        twoFactor: false,
        role: "ROLE_USER",
        birth: "1999-01-01",
        genre: "homme",
        discovery: false,
        typeMeeting: { type: "découverte" },
      },
    });
  }
  return res.status(200).json({
    status: 200,
    message: "Fixtures créé",
  });
}
