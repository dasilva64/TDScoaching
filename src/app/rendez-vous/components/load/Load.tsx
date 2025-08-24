import React from "react";
import styles from "./Load.module.scss";

const Load = () => {
  return (
    <>
      <div className={styles.load}>
        <div className={styles.load__container__arc}>
          <div className={styles.load__container__arc__circle}></div>
        </div>
        <p>Chargement ...</p>
      </div>
    </>
  );
};

export default Load;
