import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export async function POST(req: any, res: NextApiResponse) {
  const { mail, password } = await req.json();

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
      return new Response(
        JSON.stringify({
          status: 404,
          body: { message: "Not found" },
        }),
        {
          status: 404,
        }
      );
    } else {
      let token = jsonwebtoken.sign(
        { user: user.mail },
        process.env.SECRET_TOKEN as string
      );
      return new Response(
        JSON.stringify({
          status: 200,
          body: user,
          message: "OK",
        }),
        {
          status: 200,
          headers: { 'Set-Cookie': `token=${token}; HttpOnly` },
        }
      );
    }
  } else {
    return new Response(
      JSON.stringify({
        status: 404,
        body: { message: "Not found" },
      }),
      {
        status: 404,
      }
    );
  }
}

export async function GET(req: any, res: NextApiResponse) {
  return new Response("hi");
  /* if (req.method === "POST") {
    return res.status(200).json({
      status: 200,
      body: { message: "OK" },
    });
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
  } */
}
