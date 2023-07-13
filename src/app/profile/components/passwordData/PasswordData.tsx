"use client";

import { AppDispatch } from "../../../redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PasswordData.module.scss";

const PasswordData = () => {
  const dispatch = useDispatch<AppDispatch>();

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
