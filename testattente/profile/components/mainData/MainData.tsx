
import React from "react";
import styles from "./MainData.module.scss";

const MainData = () => {
  return (
    <>
        <>
          <div className={styles.mainData}>
            <ul className={styles.mainData__ul}>
              <li
                className={`${styles.mainData__ul__li} ${styles.mainData__ul__li__margin}`}
              >
                Prénom : {"firstname"}
              </li>
              <li className={styles.mainData__ul__li}>
                Nom : {"lastname"}
              </li>
            </ul>
            <div className={styles.mainData__div}>
              <button
                onClick={() => {
                }}
                className={styles.mainData__div__button}
              >
                Modifier
              </button>
            </div>
          </div>
        </>
    </>
  );
};

export default MainData;
