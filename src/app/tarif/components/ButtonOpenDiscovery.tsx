"use client";

import React from "react";
import { useDispatch } from "react-redux";
import styles from "./ButtonOpenDiscovery.module.scss";

const ButtonOpenDiscovery = () => {
  const dispatch = useDispatch();
  const handlerClick = () => {
    dispatch({
      type: "ModalDiscovery/open",
    });
  };
  return (
    <button
      className={`${styles.button} modalOpen`}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        handlerClick();
      }}
    >
      voir détail
    </button>
  );
};

export default ButtonOpenDiscovery;
