import React from "react";
import styles from "./page.module.scss";
import Error from "./components/error/Error";
import Image from "next/image";

const NotFound = () => {
  return (
    <main className={styles.notfound}>
      <div className={styles.notfound__container}>
        <h1 className={styles.notfound__container__h1}>404</h1>
        <h2 className={styles.notfound__container__h2}>Page non trouvé</h2>
        <div className={styles.notfound__container__article}>
          <Image
            className={styles.notfound__container__article__img}
            src="/assets/icone/face-frown-regular.svg"
            alt="404"
            width={50}
            height={50}
          />
          <Error />
        </div>
      </div>
    </main>
  );
};

export default NotFound;
