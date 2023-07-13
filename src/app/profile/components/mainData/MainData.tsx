"use client";

import React from "react";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import styles from "./MainData.module.scss";
import useUserGet from "@/app/components/hook/useUserGet";

const MainData = () => {
  const {userData} = useUserGet()
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <>
        <div className={styles.mainData}>
          <ul className={styles.mainData__ul}>
            <li
              className={`${styles.mainData__ul__li} ${styles.mainData__ul__li__margin}`}
            >
              Prénom : {userData?.body.firstname}
            </li>
            <li className={styles.mainData__ul__li}>Nom : {userData?.body.lastname}</li>
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
