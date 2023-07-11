import React from "react";
import styles from "./page.module.scss";
import Error from "./components/error/Error";

const NotFound = () => {
  return (
    <main className={styles.home}>
      <h1 className={styles.home__h1}>Page non trouvé</h1>
      <div className={styles.home__container}>
        <div className={styles.home__article}>
          <Error />
        </div>
      </div>
    </main>
  );
};

export default NotFound;
