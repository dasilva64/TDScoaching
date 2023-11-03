"use client";

import React from "react";
import { useDispatch } from "react-redux";
import styles from "./ButtonOpenNormal.module.scss";

const ButtonOpenNormal = () => {
  const dispatch = useDispatch();
  const handlerClick = () => {
    console.log("click");
    dispatch({
      type: "ModalNormal/open",
    });
  };
  return (
    <button
      className={styles.button}
      onClick={() => {
        handlerClick();
      }}
    >
      voir détail
    </button>
  );
};

export default ButtonOpenNormal;
