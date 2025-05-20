import React from "react";
import styles from "./page.module.scss";
import NoScript from "../components/noscript/NoScript";
import AllMeeting from "./components/AllMeeting";

export const metadata = {
  title: "Tous les rendez-vous - tdscoaching",
  description: "Consultez la liste de tous les rendez-vous de tdscoaching.",
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

      <main className={styles.allMeeting}>
        <h1 className={`${styles.allMeeting__h1}`}>Tous les rendez-vous</h1>
        <div className={styles.allMeeting__container}>
          <div className={styles.allMeeting__article}>
            <div>
              <AllMeeting />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
