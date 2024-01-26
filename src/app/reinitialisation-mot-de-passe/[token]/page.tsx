import React from "react";
import styles from "./page.module.scss";
import Reset from "./components/Reset";
import NoScript from "@/app/components/noscript/NoScript";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../Parisienne-Regular.ttf",
  display: "swap",
});

const ResetPassword = () => {
  return (
    <>
      <NoScript />
      <main className={styles.reset}>
        <h1 className={`${styles.reset__h1} ${Parisienne.className}`}>
          Réinitialisation du mot de passe
        </h1>
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
