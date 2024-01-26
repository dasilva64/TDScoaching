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
  password: "complex_password_at_least_32_characters_long",
  cookieName: "iron-examples-app-router-client-component-route-handler-swr",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: undefined,
  },
};
export const sessionOptionsRemeber: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "iron-examples-app-router-client-component-route-handler-swr",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst

/* declare module "iron-session" {
  interface IronSessionData {
    user?: any;
  }
} */

/* export interface SessionData {
  username: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  username: "",
  isLoggedIn: false,
};

export const sessionsOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "iron-examples-app-router-client-component-route-handler-swr",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: true,
  },
}; */
