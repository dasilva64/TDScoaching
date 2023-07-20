"use client";

import { AppDispatch } from "../../../redux/store";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./PasswordData.module.scss";

const PasswordData = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <>
        <div className={styles.passwordData}>
        <h3 className={styles.passwordData__h3}>Mot de passe</h3>
          <ul className={styles.passwordData__ul}>
            <li
              className={`${styles.passwordData__ul__li} ${styles.passwordData__ul__li__margin}`}
            >
              Mot de passe : {"*".toString().repeat(6)}
            </li>
          </ul>
          <p>Vous pouvez modifier votre mot de passe en cliquant sur le bouton ci-dessous</p>
          <div className={styles.passwordData__div}>
            <button
              onClick={() => {
                dispatch({
                  type: "form/openModalEditPasswordData",
                });
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
