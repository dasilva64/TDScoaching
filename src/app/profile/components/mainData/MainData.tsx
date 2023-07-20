"use client";

import React from "react";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import styles from "./MainData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";

const MainData = () => {
  const { userData, isLoading, isError } = useUserGet();
  const dispatch = useDispatch<AppDispatch>();
  let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
      <div className={styles.mainData__loadData}>
        Chargement des données
        <div className={styles.mainData__loadData__arc}>
          <div className={styles.mainData__loadData__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (userData) {
      content = (
        <>
        <h3 className={styles.mainData__h3}>Information principale</h3>
          <ul className={styles.mainData__ul}>
            <li
              className={`${styles.mainData__ul__li} ${styles.mainData__ul__li__margin}`}
            >
              Prénom : {userData?.body.firstname}
            </li>
            <li className={styles.mainData__ul__li}>
              Nom de famille : {userData?.body.lastname}
            </li>
          </ul>
          <p>Vous pouvez modifier votre prénom et votre nom de famille en cliquant sur le bouton ci-dessous</p>
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
        </>
      );
    }
  }
  return (
    <>
      <div className={styles.mainData}>{content}</div>
    </>
  );
};

export default MainData;
