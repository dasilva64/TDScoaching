import React from "react";
import styles from "./page.module.scss";

const page = () => {
  return (
    <main className={styles.historique}>
      <h1 className={styles.historique__h1}>
        En attente de suppression du compte
      </h1>
      <div className={styles.historique__container}>
        <div className={styles.historique__article}>
          <h2 className={styles.historique__article__h2}>en attente</h2>
          <div></div>
        </div>
      </div>
    </main>
  );
};

export default page;
