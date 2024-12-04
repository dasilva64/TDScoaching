import React from "react";
import styles from "./page.module.scss";
import NoScript from "@/app/components/noscript/NoScript";
import localFont from "next/font/local";
import Content from "./components/Content";
import { Providers } from "./redux/provider";
const Parisienne = localFont({
  src: "../../Parisienne-Regular.ttf",
  display: "swap",
});

export const metadata = {
  title: "Votre rendez-vous - tdscoaching",
  description: "Votre rendez-vous.",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  author: "Thierry Da Silva",
  robots: "noindex, nofollow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};

const page = () => {
  return (
    <>
      <NoScript />
      <main className={styles.meet}>
        <h1 className={`${styles.meet__h1} ${Parisienne.className}`}>
          Votre rendez-vous
        </h1>
        <Content />
      </main>
    </>
  );
};

export default page;
