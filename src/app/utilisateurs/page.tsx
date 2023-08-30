import React from "react";
import styles from "./page.module.scss";
import AllUser from "./components/allUser/AllUser";

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
      <main className={styles.allUser}>
        <h1 className={styles.allUser__h1}>Tous les utilisateurs</h1>
        <div className={styles.allUser__container}>
          <div className={styles.allUser__article}>
            <div>
              <AllUser />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
