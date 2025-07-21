import React from "react";
import styles from "./Load.module.scss";

const Load = () => {
  return (
    <>
      <div className={styles.load}>
        <div className={styles.load__container__arc}>
          <div className={styles.load__container__arc__circle}></div>
        </div>
        <p>Nous vous redirigeons vers votre rendez-vous. Patience, nous vérifions votre session...</p>
      </div>
    </>
  );
};

export default Load;
