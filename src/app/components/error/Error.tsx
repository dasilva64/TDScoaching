"use client";

import React, { useEffect } from "react";
import styles from "../../page.module.scss";
import { useRouter } from "next/navigation";

const Error = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, [router]);
  return (
    <h2 className={styles.home__article__h2}>
      La page actuelle n&apos;a pas été trouvé vous allez être redirigé vers la
      page d&apos;acceuil
    </h2>
  );
};

export default Error;
