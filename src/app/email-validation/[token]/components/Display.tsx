"use client";

import React from "react";
import styles from "./Display.module.scss";
import useUserEmailValidation from "../../../components/hook/useUserEmailValidation";

const Display = () => {
  useUserEmailValidation();
  return (
    <>
      <h2 className={styles.h2}>En attente de validation</h2>
    </>
  );
};

export default Display;
