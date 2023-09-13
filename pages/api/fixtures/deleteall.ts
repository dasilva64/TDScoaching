import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function sendTokenEditPhone(req: any, res: any) {
  const deleteMeeting = await prisma.meeting.deleteMany({});
  const deleteUser = await prisma.user.deleteMany({});
  return res.status(200).json({
    status: 200,
    message: "Fixtures delete",
  });
}
