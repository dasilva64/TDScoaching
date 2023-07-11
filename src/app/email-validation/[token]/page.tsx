import React from "react";
import styles from "./page.module.scss";
import Display from "./components/Display";

const EmailValidation = () => {
  return (
    <main className={styles.emailValidation}>
      <h1 className={styles.emailValidation__h1}>
        Validation de l'addresse email
      </h1>
      <div className={styles.emailValidation__container}>
        <div className={styles.emailValidation__article}>
          <Display />
        </div>
      </div>
    </main>
  );
};

export default EmailValidation;
