"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./goTarif.module.scss";
import Link from "next/link";

const GoTarif = () => {
  const router = useRouter();
  return (
    <Link href="/tarif" className={`${styles.btn} modalOpen`} tabIndex={1}>
      Voir les offres
    </Link>
  );
};

export default GoTarif;
