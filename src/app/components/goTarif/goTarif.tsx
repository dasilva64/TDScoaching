"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./goTarif.module.scss";

const GoTarif = () => {
  const router = useRouter();
  return (
    <button
      className={styles.btn}
      onClick={() => {
        router.push("/tarif");
      }}
    >
      Voir les offres
    </button>
  );
};

export default GoTarif;
