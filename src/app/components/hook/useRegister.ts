import { AppDispatch } from "@/app/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchUserRegister = async (
  url: string,
  {
    arg,
  }: {
    arg: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
      phone: string;
    };
  }
) => {
  let response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(arg),
  });
  let json = await response.json();
  return json;
};

export default fetchUserRegister;
