"use client";

import React from "react";
import { useDispatch } from "react-redux";
import styles from "./ButtonOpenDiscovery.module.scss";

const ButtonOpenDiscovery = () => {
  const dispatch = useDispatch();
  const handlerClick = () => {
    console.log("click");
    dispatch({
      type: "ModalDiscovery/open",
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

export default ButtonOpenDiscovery;
