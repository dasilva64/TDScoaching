import prisma from "../../../lib/prisma";

 export default async function sendTokenEditPhone(req: any, res: any) {
  let user = await prisma.user.findMany({
    where: {
      role: "ROLE_USER",
    },
  });
  for (let i = 0; i < user.length; i++) {
    let UserCreate = await prisma.meeting.create({
      data: {
        startAt: new Date(2023, 7, 22+i, 15, 0, 0),
        endAt: new Date(2023, 7, 22+i, 16, 0, 0),
        status: true,
        userId: user[i].id,
      },
    });
  }

  
  return res.status(200).json({
    status: 200,
    message: "Fixtures créé",
  });
    /* let currentDate = new Date(2023, 7, 22, 15, 0, 0)
    let currentDateEnd = new Date(2023, 7, 22, 16, 0, 0)
    for (let i = 0; i < 100; i++) {
        
        currentDate.setHours(currentDate.getHours() + i)
        currentDateEnd.setHours(currentDateEnd.getHours() + i)
      let UserCreate = await prisma.meeting.create({
        data: {
          startAt: new Date(currentDate),
          endAt: new Date(currentDateEnd),
          status: true,
          userId: "dbd50a3c-de20-47f2-b228-0829b15cd7d5",
        },
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Fixtures créé",
    }); */
  }
