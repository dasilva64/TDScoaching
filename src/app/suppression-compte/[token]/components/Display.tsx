"use client";

import React from "react";
import styles from "./Display.module.scss";
import { usePathname } from "next/navigation";
import useDeleteAccount from "../../../components/hook/user/useDeleteAccount";
import Load from "./load/Load";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const Display = () => {
  const queryParam: any = usePathname();
  const {csrfToken} = useSelector((state: RootState) => state.csrfToken)
  let token = queryParam.toString().split("/");
  const { data, isLoading, error } = useDeleteAccount(token[2], csrfToken);
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
