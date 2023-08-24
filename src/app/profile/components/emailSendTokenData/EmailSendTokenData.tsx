"use client";

import { AppDispatch } from "../../../redux/store";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./EmailSendTokenData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";

const EmailData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, isLoading, isError } = useUserGet();

  let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
      <div className={styles.emailData__loadData}>
        Chargement des données
        <div className={styles.emailData__loadData__arc}>
          <div className={styles.emailData__loadData__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (userData) {
      content = (
        <>
          <h3 className={styles.emailData__h3}>Adresse email</h3>
          <ul className={styles.emailData__ul}>
            <li
              className={`${styles.emailData__ul__li} ${styles.emailData__ul__li__margin}`}
            >
              email : {userData?.body.email}
            </li>
          </ul>
          <div className={styles.emailData__div}>
            <>
              <p>
                Vous pouvez modifier votre adresse email en cliquant sur le
                bouton ci-dessous
              </p>
              <button
                onClick={() => {
                  dispatch({
                    type: "form/openModalEditEmailSendData",
                  });
                }}
                className={styles.emailData__div__button}
              >
                Modifier
              </button>
            </>
          </div>
        </>
      );
    }
  }
  return (
    <>
      <>
        <div className={styles.emailData}>{content}</div>
      </>
    </>
  );
};

export default EmailData;
