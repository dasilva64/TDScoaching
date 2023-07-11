import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchDeleteMeeting = async (url: string) => {
  let response = await fetch(url, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  let json = await response.json();
  return json;
};

export default fetchDeleteMeeting;
