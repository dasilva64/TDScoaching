import React from "react";
import styles from "./page.module.scss";
import Display from "./components/Display";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoScript from "@/app/components/noscript/NoScript";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../Parisienne-Regular.ttf",
  display: "swap",
});

export const metadata = {
  title: "Suppression du compte - tdscoaching",
  description: "Suppression du compte tdscoaching.",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  author: "Thierry Da Silva",
  robots: "index, follow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};
const page = async () => {
  return (
    <>
      <NoScript />
      <main className={styles.delete}>
        <h1 className={`${styles.delete__h1} ${Parisienne.className}`}>
          En attente de suppression du compte
        </h1>
        <div className={styles.delete__container}>
          <Display />
        </div>
      </main>
    </>
  );
};

export default page;
