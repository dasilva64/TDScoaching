import React from "react";
import styles from "./page.module.scss";
import Reset from "@/app/components/reset/Reset";

const ResetPassword = () => {
  return (
    <>
      <main className={styles.reset}>
        <h1 className={styles.reset__h1}>Réiniitalisation du mot de passe</h1>
        <div className={styles.reset__container}>
          <div className={styles.reset__article}>
            <h2 className={styles.reset__article__h2}>Formulaire</h2>
            <Reset />
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
