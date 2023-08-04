import { unsealData } from "iron-session";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface IronSessionData {
    user?: any
}

export async function getRequestCookie(
    cookies: ReadonlyRequestCookies
): Promise<IronSessionData | null> {
    const cookieName = "test";
    const foundCookie = cookies.get(cookieName);
    console.log('foundCookie', foundCookie)
    if (!foundCookie) {
        return null;
    }
    const { user } = await unsealData(foundCookie.value, {
        password: "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
        });
    return user as unknown as IronSessionData;
}