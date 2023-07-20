import React from "react";
import Content from "./components/Content";
import styles from "./page.module.scss";

const page = () => {
  return (
    <>
      <main className={styles.user}>
        <h1 className={styles.user__h1}>Donnée d&apos;un utilisateur</h1>
        <div className={styles.user__container}>
          <Content />
        </div>
      </main>
    </>
  );
};

export default page;
