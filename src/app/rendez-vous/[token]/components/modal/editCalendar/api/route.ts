/* import prisma from "../../../../../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import validator from "validator";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
    const token = (await params).token
    if (token === null) {
        return NextResponse.json(
          {
            status: 400,
            message: "La requête n'est pas valide, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      } else {
        token
        .trim()
        .split(".")
        .map((t) => {
          t.split("").map((r) => {
            if (r === "<" || r === ">") {
              return NextResponse.json(
                {
                  status: 400,
                  message: "Le token n'est pas valide, veuillez réessayer",
                },
                {
                  status: 400,
                }
              );
            }
          });
        });
      let split = token.trim().split(".");
      if (
        split[0].length === 36 &&
        split[1].length > 0 &&
        split[2].length === 43 &&
        split.length === 3
      ) {
        const { verify } = jwt;
        try {
            const decodeToken: any = verify(
                validator.escape(token.trim()),
                process.env.SECRET_TOKEN_DISCOVERY_MEETING as string
              );
            const meet = await prisma.meetingDiscovery.findUnique({
                where: {userMail: decodeToken.user}
            })
            const allMeeting = await prisma.meeting.findMany({
                where: { startAt: { gte: new Date() } },
                select: {
                startAt: true,
                },
            });
            let userObject = {
                meetings: allMeeting,
            };
            return NextResponse.json(
                {
                status: 200,
                body: token,
                },
                {
                status: 200,
                }
            );
        } catch (e) {

        }
      } else {
        return NextResponse.json(
          {
            status: 400,
            message: "La requête n'est pas valide, veuillez réessayer",
          },
          {
            status: 400,
          }
        );
      }
    }
    
  } */