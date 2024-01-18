import React from "react";
import styles from "./page.module.scss";
import Reset from "./components/Reset";

const ResetPassword = () => {
  return (
    <>
      <noscript
        style={{
          width: "100%",
          padding: "20px 0",
          background: "red",
          position: "fixed",
          bottom: "0",
          left: "0",
          zIndex: "999",
          color: "white",
          textAlign: "center",
        }}
      >
        Veuillez activer JavaScript pour profiter pleinement de notre site.
      </noscript>
      <main className={styles.reset}>
        <h1 className={styles.reset__h1}>Réinitialisation du mot de passe</h1>
        <div className={styles.reset__container}>
          <div className={styles.reset__article}>
            <p className={styles.reset__article__p}>
              Vous pouvez réinitialiser votre mot de passe en remplissant le
              formulaire ci-dessous.
            </p>
            <Reset />
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
