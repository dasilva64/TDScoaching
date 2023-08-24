"use client";

import React from "react";
import styles from "./Display.module.scss";
import useUserEmailValidation from "@/app/components/hook/user/useUserEmailValidation";
import { usePathname } from "next/navigation";
import useDeleteAccount from "@/app/components/hook/user/useDeleteAccount";

const Display = () => {
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  const { data, isLoading, error } = useDeleteAccount(token[2]);
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
      <div className={styles.display__loadData}>
        Chargement des données
        <div className={styles.display__loadData__arc}>
          <div className={styles.display__loadData__arc__circle}></div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={styles.display}>{content}</div>
    </>
  );
};

export default Display;
