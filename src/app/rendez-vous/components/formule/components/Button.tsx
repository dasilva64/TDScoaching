"use client";

import fetchGet from "@/app/components/fetch/fetchGet";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "./Button.module.scss";

const Button = () => {
  const { trigger, data, reset } = useSWRMutation("/api/user/check", fetchGet);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        reset();
        router.push("/rendez-vous");
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "success",
            flashMessage: "Vous devez être connecté pour réserver une séance",
          },
        });
        dispatch({
          type: "ModalLogin/open",
        });
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage:
              "Une erreur est survenue, veuillez réessayer plus tard",
          },
        });
        reset();
      }
    }
  }, [data, dispatch, reset, router]);
  const handleClick = () => {
    trigger();
  };
  return (
    <button
      className={styles.button}
      onClick={() => {
        handleClick();
      }}
    >
      Réserver une séance
    </button>
  );
};

export default Button;
