import React from "react";
import styles from "./page.module.scss";
import AllUser from "./components/AllUser";
import NoScript from "../components/noscript/NoScript";

export const metadata = {
  title: "Tous les utilisateurs - tdscoaching",
  description:
    "Consultez la liste de tous les utilisateurs inscrits sur le site tdscoaching.",
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

      <main className={styles.allUser}>
        <h1 className={`${styles.allUser__h1}`}>Tous les utilisateurs</h1>
        <div className={styles.allUser__container}>
          <div className={styles.allUser__article}>
            <div>
              <AllUser />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
