import Content from "./display/Content";
import { cookies } from "next/headers";
import { getRequestCookie } from "../../../../lib/getRequestCookie";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/user/check");
  const data = await res.json();
  return data;
};

const Header = async () => {
  const data = await getData();
  //const user = await getRequestCookie(cookies());
  console.log(data);
  return (
    <>
      <Content userLog={data} />
    </>
  );
};

export default Header;
