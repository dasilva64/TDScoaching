"use client";

import React from "react";
import { useDispatch } from "react-redux";
import styles from "./Button.module.scss";
import Link from "next/link";

const Button = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch({
      type: "flash/storeFlashMessage",
      payload: {
        type: "success",
        flashMessage:
          "Veuillez me contacter si vous voulez réserver une séance ou si vous avez une question",
      },
    });
  };
  return (
    <>
      <Link
      target="_blank"
        href="https://www.resalib.fr/praticien/116664-thierry-da-silva-seabra-coach-de-vie-chambery"
        className={`${styles.button} modalOpen`}
        /* onClick={() => {
          handleClick();
        }} */
      >
        Réserver une séance
      </Link>
    </>
  );
};

export default Button;
