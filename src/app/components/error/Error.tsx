"use client";

import React, { useEffect } from "react";
import styles from "../../page.module.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Error = () => {
  const router = useRouter();
  return (
    <>
      <h2 className={styles.notfound__container__article__p}>
        La page actuelle n&apos;a pas été trouvé vous allez être redirigé vers
        la page d&apos;acceuil
      </h2>
      <div className={styles.notfound__container__article__box}>
        <Link
          className={styles.notfound__container__article__box__link}
          href={""}
          onClick={() => router.back()}
        >
          Revenir sur la page précèdente
        </Link>
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
