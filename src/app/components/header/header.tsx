import Content from "./display/Content";
import { cookies } from "next/headers";
import { getRequestCookie } from "../../../../lib/getRequestCookie";

const getData = async () => {
  const res = await fetch("https://testtds-vogj.vercel.app/api/user/check", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(res);
  return res.json();
};

const Header = async () => {
  const data = await getData();
  console.log(data);
  //const user = await getRequestCookie(cookies());
  return (
    <>
      <Content userLog={"data"} />
    </>
  );
};

export default Header;
