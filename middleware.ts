import { getIronSession } from "iron-session/edge"
import { NextRequest, NextResponse } from "next/server"

export const middleware = async (req: NextRequest) => {
     const res = NextResponse.next()
     const session = await getIronSession(req, res, {
        cookieName: "test",
        password: "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production"
        }
     })
     const {user} = session
     if (!user) {
        return NextResponse.redirect(new URL('/', req.url))
     }
     if (user.role !== "ROLE_USER") {
        return NextResponse.redirect(new URL('/', req.url))
     }
     return res
}

export const config = {
    matcher: "/profile",
}