import React from "react";
import styles from "./page.module.scss";
import Display from "./components/Display";

const EmailValidation = () => {
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
      <main className={styles.emailValidation}>
        <h1 className={styles.emailValidation__h1}>
          Validation de l&apos;addresse email
        </h1>
        <div className={styles.emailValidation__container}>
          <div className={styles.emailValidation__article}>
            <Display />
          </div>
        </div>
      </main>
    </>
  );
};

export default EmailValidation;
