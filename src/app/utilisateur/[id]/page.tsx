import React from "react";
import Content from "./components/Content";
import styles from "./page.module.scss";

const page = () => {
  return (
    <>
      <noscript
        style={{
          width: "100%",
          padding: "20px 0",
          background: "red",
          position: "fixed",
          bottom: "0",
          left: "0",
          zIndex: "999",
          color: "white",
          textAlign: "center",
        }}
      >
        Veuillez activer JavaScript pour profiter pleinement de notre site.
      </noscript>
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
