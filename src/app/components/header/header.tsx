import Content from "./display/Content";
import { cookies } from "next/headers";
import { getRequestCookie } from "../../../../lib/getRequestCookie";

const Header = async () => {
  const user = await getRequestCookie(cookies());
  return (
    <>
      <Content userLog={user} />
    </>
  );
};

export default Header;
