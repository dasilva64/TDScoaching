import { IronSessionOptions } from "iron-session";

export type User = {
    id: number;
    email: string;
    login: boolean;
    role: string;
}

export const sessionOptions: IronSessionOptions = {
    password: "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
    cookieName: "test",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

declare module "iron-session" {
    interface IronSessionData {
        user?: any
    }
}
