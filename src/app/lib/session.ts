import { SessionOptions } from "iron-session";

export interface SessionData {
  id: string;
  isLoggedIn: boolean;
  role: string;
}

export const defaultSession: SessionData = {
  id: "",
  isLoggedIn: false,
  role: "",
};

export const sessionOptions: SessionOptions = {
  password: {
    1: process.env.IRON_PASSWORD as string,
    2: process.env.IRON_PASSWORD_TWO as string,
  },
  cookieName: "iron-session-cookie-login-user-tds",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    //secure: process.env.NODE_ENV === "production",
     maxAge: undefined,
    /*httpOnly: true,
    path: "/",
    sameSite: "strict" */
  },
};
export const sessionOptionsRemeber: SessionOptions = {
  password: {
    1: process.env.IRON_PASSWORD as string,
    2: process.env.IRON_PASSWORD_TWO as string,
  },
  cookieName: "iron-session-cookie-login-user-tds",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    //secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    path: "/",
    sameSite: "strict"
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

