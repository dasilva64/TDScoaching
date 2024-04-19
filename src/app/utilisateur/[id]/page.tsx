import React from "react";
import Content from "./components/Content";
import styles from "./page.module.scss";
import NoScript from "@/app/components/noscript/NoScript";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import localFont from "next/font/local";
import { SessionData, sessionOptions } from "../../../../lib/session";
const Parisienne = localFont({
  src: "../../Parisienne-Regular.ttf",
  display: "swap",
});

export const metadata = {
  title: "Donnée d'un utilisateur - tdscoaching",
  description:
    "Consultez les données d'un utilisateur inscrit sur le site tdscoaching.",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  author: "Thierry Da Silva",
  robots: "noindex, nofollow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};
const page = async () => {
  return (
    <>
      <NoScript />

      <main className={styles.user}>
        <h1 className={`${styles.user__h1} ${Parisienne.className}`}>
          Donnée d&apos;un utilisateur
        </h1>
        <div className={styles.user__container}>
          <Content />
        </div>
      </main>
    </>
  );
};

export default page;
