"use client";

import React from "react";
import styles from "./Display.module.scss";
import useUserEmailValidation from "@/app/components/hook/user/useUserEmailValidation";
import { usePathname } from "next/navigation";

const Display = () => {
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  const { data, isLoading, error } = useUserEmailValidation(token[2]);
  let content;
  if (error) {
    content = <div className={styles.display__loadData}>{data.message}</div>;
  }
  if (isLoading) {
    content = (
      <div className={styles.display__loadData}>
        Chargement des données
        <div className={styles.display__loadData__arc}>
          <div className={styles.display__loadData__arc__circle}></div>
        </div>
      </div>
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
