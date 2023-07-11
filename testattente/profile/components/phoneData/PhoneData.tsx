
import React from "react";
import styles from "./PhoneData.module.scss";

const PhoneData = () => {
  
  return (
    <>
      <>
        <div className={styles.phoneData}>
          <ul className={styles.phoneData__ul}>
            <li
              className={`${styles.phoneData__ul__li} ${styles.phoneData__ul__li__margin}`}
            >
              Téléphone : {"phone"}
            </li>
          </ul>
          <div className={styles.phoneData__div}>
            <button
              className={styles.phoneData__div__button}
              onClick={() => {
              }}
            >
              Modifier
            </button>
          </div>
        </div>
      </>
    </>
  );
};

export default PhoneData;
