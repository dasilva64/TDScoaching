"use client";

import React from "react";
import { useDispatch } from "react-redux";
import styles from "../header.module.scss";

const BtnNav = ({ name }: any) => {
  const dispatch = useDispatch();
  return (
    <>
      <p
        className={`${styles.header__a} ${styles.header__free} modalOpen`}
        onClick={() => {
          dispatch({ type: "ModalDiscoveryMeetingTest/open" });
        }}
      >
        {name}
      </p>
    </>
  );
};

export default BtnNav;
