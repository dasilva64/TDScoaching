
import React from "react";
import styles from "./PasswordData.module.scss";

const PasswordData = () => {

  return (
    <>
        <>
          <div className={styles.passwordData}>
            <ul className={styles.passwordData__ul}>
              <li
                className={`${styles.passwordData__ul__li} ${styles.passwordData__ul__li__margin}`}
              >
                password : {"*".toString().repeat(6)}
              </li>
            </ul>
            <div className={styles.passwordData__div}>
              <button
                onClick={() => {
                }}
                className={styles.passwordData__div__button}
              >
                Modifier
              </button>
            </div>
          </div>
        </>
    </>
  );
};

export default PasswordData;
