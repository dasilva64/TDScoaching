"use client";

import React from "react";
import styles from "./Display.module.scss";
import useUserEmailValidation from "../../../components/hook/user/useUserEmailValidation";
import { usePathname } from "next/navigation";
import useDeleteAccount from "../../../components/hook/user/useDeleteAccount";

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
      <div className={styles.display}>
        Chargement des données
        <div className={styles.display__arc}>
          <div className={styles.display__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className={styles.display}>
        <p className={styles.display__p}>
          Votre compte va être supprimé et toutes les données associées seront
          effacées.
        </p>
      </div>
    );
  }
  return <>{content}</>;
};

export default Display;
