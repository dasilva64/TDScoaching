"use client";

import React from "react";
import styles from "./Display.module.scss";
import useUserEmailValidation from "../../../components/hook/user/useUserEmailValidation";
import { usePathname } from "next/navigation";
import Load from "./load/Load";

const Display = () => {
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  const { data, isLoading, error } = useUserEmailValidation(token[2]);
  let content;
  if (error) {
    content = (
      <div className={styles.display__loadData}>
        Erreur lors du chargement des données
      </div>
    );
  }
  if (isLoading) {
    content = (
      <Load />
    );
  } else {
    content = <div className={styles.display__loadData}>{data.message}</div>;
  }
  return (
    <>
      <div className={styles.display}>{content}</div>
    </>
  );
};

export default Display;
