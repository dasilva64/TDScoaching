"use client";

import { RootState } from "../../../redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PhoneSendTokenData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";

const PhoneData = () => {
  const dispatch = useDispatch();
  const { userData, isLoading, isError } = useUserGet();
  let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
      <div className={styles.phoneData__loadData}>
        Chargement des données
        <div className={styles.phoneData__loadData__arc}>
          <div className={styles.phoneData__loadData__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (userData) {
      content = (
        <>
          <h3 className={styles.phoneData__h3}>Numéro de téléphone</h3>
          <ul className={styles.phoneData__ul}>
            <li
              className={`${styles.phoneData__ul__li} ${styles.phoneData__ul__li__margin}`}
            >
              Téléphone : {userData?.body.phone}
            </li>
          </ul>
          <>
            <p>
              Vous pouvez modifier votre numéro de téléphone en cliquant sur le
              bouton ci-dessous
            </p>
            <div className={styles.phoneData__div}>
              <button
                className={styles.phoneData__div__button}
                onClick={() => {
                  dispatch({
                    type: "form/openModalEditPhoneSendData",
                  });
                }}
              >
                Modifier
              </button>
            </div>
          </>
        </>
      );
    }
  }

  return (
    <>
      <>
        <div className={styles.phoneData}>{content}</div>
      </>
    </>
  );
};

export default PhoneData;
