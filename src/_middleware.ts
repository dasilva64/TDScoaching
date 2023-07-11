import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import { headers } from "next/headers";

export async function middleware(req: NextRequest) {
  //let header = headers()
  let cookie = req.cookies.get('token')
  let test = req.cookies.get("token")?.value
  console.log(req.cookies.get("token")?.value) 
  console.log(req.cookies.get("token")?.value) 
  console.log(req.cookies.get("token")) 
  console.log(req.cookies.get("token")) 
  console.log(cookie) 

  //let cookie = header.get("token")
  if (test) {
    return NextResponse.redirect("/profile");
  } else {
    return NextResponse.redirect("http://localhost:3000/");
  }
  /* 
  if (
    req.nextUrl.pathname.startsWith("/login") &&
    (!token || redirectToLogin)
  ) {
    return;
  }

  if (!token) {
    return new Response(
      JSON.stringify({
        status: 401,
        message: "Not found",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const response = NextResponse.next();

  try {
    if (token) {
      const { verify } = jsonwebtoken;
      const decodeToken: any = verify(
        token,
        process.env.SECRET_TOKEN as string
      );
      (req as AuthenticatedRequest).user;
    }
  } catch (error) {
    redirectToLogin = true;
    if (req.nextUrl.pathname.startsWith("/api")) {
      return new Response(
        JSON.stringify({
          status: 401,
          message: "Not found",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    return NextResponse.redirect("/login");
  }
  const authUser = (req as AuthenticatedRequest).user;
  if (!authUser) {
    return NextResponse.redirect("/login");
  }
  if (req.url.includes("login") && authUser) {
    return NextResponse.redirect("/");
  }
  return response; */
}

export const config = {
  matcher: ["/profile"],
};
