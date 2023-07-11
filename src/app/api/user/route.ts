import { NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import jsonwebtoken from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req: any, res: NextApiResponse) {
  /* const { verify } = jsonwebtoken;
  let token = req.headers["authorization"]?.split(" ")[1];
  const decodeToken: any = verify(token, process.env.SECRET_TOKEN as string);
  console.log(decodeToken); */
  try {
    let token = req.cookies.get("token");
    const { verify } = jsonwebtoken;
    const decodeToken: any = verify(
      token.value,
      process.env.SECRET_TOKEN as string
    );
    if (decodeToken) {
      return NextResponse.json(
        JSON.stringify({
          status: 200,
          body: { message: decodeToken },
        }),
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        JSON.stringify({
          status: 400,
          body: { message: "Not found" },
        }),
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      JSON.stringify({
        status: 401,
        body: { message: "Not found" },
      }),
      {
        status: 401,
      }
    );
  }
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibUBtLmNvbSIsImlhdCI6MTY4OTA5NTc2OX0.CvNh6Ao7E7AffZ5rWURsNSNEXsONpWOE1n64PCUEAmc
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibUBtLmNvbSIsImlhdCI6MTY4OTA5NTc2OX0.CvNh6Ao7E7AffZ5rWURsNSNEXsONpWOE1n64PCUEAmc

 /*  if (req.method === "POST") {
    const user = await prisma.user.findUnique({
      where: { mail: "jklf" },
      include: { meeting: true },
    });
    if (user === null) {
      return res.status(400).json({
        status: 400,
        message: "L'utilisateur n'a pas été trouvé, veuillez réessayer",
      });
    } else {
      let userObject = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.mail,
        role: user.role,
        meeting: user.meeting,
        phone: user.phone,
        editEmail: user.editEmail,
      };
      res.status(200).json({
        status: 200,
        body: userObject,
      });
    }
  } */
}
