import React from "react";
import styles from "./page.module.scss";
import AllMeeting from "./components/AllMeeting";

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
      <main className={styles.allMeeting}>
        <h1 className={styles.allMeeting__h1}>Tous les rendez-vous</h1>
        <div className={styles.allMeeting__container}>
          <div className={styles.allMeeting__article}>
            <div>
              <AllMeeting />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
