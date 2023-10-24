import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function sendTokenEditPhone(req: any, res: any) {
  let encrypt1 = await bcrypt.hash("test", 10);
  let UserCreate1 = await prisma.user.create({
    data: {
      mail: "m@m.com",
      firstname: "firstname",
      lastname: "lastname",
      password: encrypt1,
      status: true,
      twoFactor: false,
      role: "ROLE_ADMIN",
      discovery: false,
      typeMeeting: { type: "découverte", coaching: "familial" },
    },
  });
  let encrypt2 = await bcrypt.hash("test", 10);
  let UserCreate2 = await prisma.user.create({
    data: {
      mail: "n@n.com",
      firstname: "firstname",
      lastname: "lastname",
      password: encrypt2,
      status: true,
      twoFactor: false,
      role: "ROLE_USER",
      discovery: false,
      typeMeeting: { type: "découverte", coaching: "familial" },
    },
  });
  for (let i = 15; i < 1000; i++) {
    let encrypt = await bcrypt.hash("password", 10);
    let UserCreate = await prisma.user.create({
      data: {
        mail: "mail" + i + "@gmail.com",
        firstname: "firstname" + i,
        lastname: "lastname" + i,
        password: encrypt,
        status: true,
        twoFactor: false,
        role: "ROLE_USER",
        discovery: false,
        typeMeeting: { type: "découverte", coaching: "familial" },
      },
    });
  }
  return res.status(200).json({
    status: 200,
    message: "Fixtures créé",
  });
}
