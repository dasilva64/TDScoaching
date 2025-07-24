import React from "react";
import styles from "./page.module.scss";
import Image from "./components/image/Image";
import Link from "next/link";

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
          <p className={styles.notfound__container__article__p}>
            La page actuelle n&apos;a pas été trouvé.
          </p>
          <div className={styles.notfound__container__article__box}>
            <Link
              className={styles.notfound__container__article__box__link}
              href={"/"}
            >
              Revenir sur la page d&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
