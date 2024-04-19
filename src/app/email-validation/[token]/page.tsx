import React from "react";
import styles from "./page.module.scss";
import Display from "./components/Display";
import NoScript from "@/app/components/noscript/NoScript";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../Parisienne-Regular.ttf",
  display: "swap",
});

export const metadata = {
  title: "Validation de votre addresse email - tdscoaching",
  description:
    "Validation de votre addresse email sur le site tdscoaching.fr pour accéder à votre compte.",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  author: "Thierry Da Silva",
  robots: "noindex, nofollow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};

const EmailValidation = () => {
  return (
    <>
      <NoScript />

      <main className={styles.emailValidation}>
        <h1 className={`${styles.emailValidation__h1} ${Parisienne.className}`}>
          Validation de votre addresse email
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
