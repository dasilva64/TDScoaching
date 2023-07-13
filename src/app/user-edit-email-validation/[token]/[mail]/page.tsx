"use client";

import useLogout from "../../../components/hook/useLogout";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ValidationNewEmail = () => {
  const dispatch = useDispatch();
  const [userClickLogout, setUserClickLogout] = useState(false);

  const { user } = useLogout(userClickLogout, setUserClickLogout);
  useEffect(() => {
    let ar = window?.location.pathname.split("/");
    console.log(ar);
    const fetchEditEmail = async () => {
      let response = await fetch("http://localhost:8080/user/editEmail", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token: ar[2], mail: ar[3] }),
      });
      let json = await response.json();
      console.log(json);
      if (json.status === 200) {
        setUserClickLogout(true);

        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: json.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: json.message },
        });
      }
    };
    fetchEditEmail();
  }, [dispatch]);
  return null;
};

export default ValidationNewEmail;
