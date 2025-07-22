import { SessionOptions } from "iron-session";

export interface SessionData {
  id: string;
  isLoggedIn: boolean;
  role: string;
  csrfToken: string;
  rememberMe: boolean;
  expireTwoFa: number | null
}

export const defaultSession: SessionData = {
  id: "",
  isLoggedIn: false,
  role: "",
  csrfToken: "",
  rememberMe: false,
  expireTwoFa: null
};

export const sessionOptions: SessionOptions = {
  password: {
    1: process.env.IRON_PASSWORD as string,
    2: process.env.IRON_PASSWORD_TWO as string,
  },
  cookieName: "iron-session-cookie-session-user-tds",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: undefined,
    httpOnly: true,
    path: "/",
    sameSite: "lax"
  },
};

