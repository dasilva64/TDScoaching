import Content from "./display/Content";
import { cookies } from "next/headers";
import { unsealData } from "iron-session";

const Header = async () => {
  //const user = await getRequestCookie(cookies());
  /* 
  const cookieStore = cookies();
  const encrytedSession = cookieStore.get("test")?.value;
  const session = encrytedSession
    ? await unsealData(encrytedSession, {
        password:
          "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
      })
    : null ;
    */
  return (
    <>
      <Content />
    </>
  );
};

export default Header;
