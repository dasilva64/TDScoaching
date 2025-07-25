"use client";

import React from "react";
import styles from "./Display.module.scss";
import useUserEmailValidation from "../../../components/hook/user/useUserEmailValidation";
import { usePathname } from "next/navigation";
import Load from "./load/Load";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";

const Display = () => {
  const {csrfToken} = useSelector((state: RootState) => state.csrfToken)
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  const { data, isLoading, error } = useUserEmailValidation(token[2], csrfToken);
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
    content = <div className={styles.display__loadData}>{data && data.message}</div>;
  }
  return (
    <>
      <div className={styles.display}>{content}</div>
    </>
  );
};

export default Display;
