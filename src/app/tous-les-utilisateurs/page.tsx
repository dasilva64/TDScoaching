import React from "react";
import styles from "./page.module.scss";
import AllUser from "./components/allUser/AllUser";

const page = () => {
  return (
    <main className={styles.allUser}>
      <h1 className={styles.allUser__h1}>Dashboard</h1>
      <div className={styles.allUser__container}>
        <div className={styles.allUser__article}>
          <h2 className={styles.allUser__article__h2}>Tous les utilisateurs</h2>
          <div>
            <AllUser />
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
