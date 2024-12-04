import React from "react";
import styles from "../../page.module.scss";
import Link from "next/link";

const Error = () => {
  return (
    <>
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
    </>
  );
};

export default Error;
