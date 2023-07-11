"use client";

import { RootState } from "@/app/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PhoneData.module.scss";

const PhoneData = () => {
  const dispatch = useDispatch()
  const { phone } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <>
        <div className={styles.phoneData}>
          <ul className={styles.phoneData__ul}>
            <li
              className={`${styles.phoneData__ul__li} ${styles.phoneData__ul__li__margin}`}
            >
              Téléphone : {phone}
            </li>
          </ul>
          <div className={styles.phoneData__div}>
            <button
              className={styles.phoneData__div__button}
              onClick={() => {
                dispatch({
                  type: 'form/openModalEditPhoneData'
                })
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
