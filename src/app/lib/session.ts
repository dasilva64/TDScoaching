import { SessionOptions } from "iron-session";

export interface SessionData {
  id: string;
  isLoggedIn: boolean;
  role: string;
  csrfToken: string;
  csrfTokenExpiry: number;
}

export const defaultSession: SessionData = {
  id: "",
  isLoggedIn: false,
  role: "",
  csrfToken: "",
  csrfTokenExpiry: 0
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
    sameSite: "strict"
  },
};
export const sessionOptionsRemeber: SessionOptions = {
  password: {
    1: process.env.IRON_PASSWORD as string,
    2: process.env.IRON_PASSWORD_TWO as string,
  },
  cookieName: "iron-session-cookie-session-user-tds",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    path: "/",
    sameSite: "strict"
  },
};
export const sessionOptionsContact: SessionOptions = {
  password: {
    1: process.env.IRON_PASSWORD as string,
    2: process.env.IRON_PASSWORD_TWO as string,
  },
  cookieName: "iron-session-cookie-session-user-tds",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    httpOnly: true,
    path: "/",
    sameSite: "strict"
  },
};
export const sessionOptionsDiscoveryMeeting: SessionOptions = {
  password: {
    1: process.env.IRON_PASSWORD as string,
    2: process.env.IRON_PASSWORD_TWO as string,
  },
  cookieName: "iron-session-cookie-session-user-tds",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    httpOnly: true,
    path: "/",
    sameSite: "strict"
  },
};

