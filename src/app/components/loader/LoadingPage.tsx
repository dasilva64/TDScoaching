"use client";
import React from "react";
import styles from "./Loading.module.scss";

const LoadingPage = () => {
  return (
    <>
      <div className={styles.load}>
        <div className={styles.load__spin}>
            <div className={styles.load__ball}></div>
            <div className={styles.load__spin__inv}>
                <div className={styles.load__ball__inv}></div>
            </div>
        </div>
        <div className={styles.load__text}>
            <p>Chargement</p>
        </div>
    </div>
    </>
  );
};

 export default LoadingPage;