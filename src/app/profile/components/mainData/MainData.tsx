"use client";

import React from "react";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import styles from "./MainData.module.scss";

const MainData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lastname, firstname } = useSelector((state: RootState) => state.auth);
  return (
    <>
        <>
          <div className={styles.mainData}>
            <ul className={styles.mainData__ul}>
              <li
                className={`${styles.mainData__ul__li} ${styles.mainData__ul__li__margin}`}
              >
                Prénom : {firstname}
              </li>
              <li className={styles.mainData__ul__li}>
                Nom : {lastname}
              </li>
            </ul>
            <div className={styles.mainData__div}>
              <button
                onClick={() => {
                  dispatch({
                    type: "form/openModalEditMainUserData",
                  });
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
