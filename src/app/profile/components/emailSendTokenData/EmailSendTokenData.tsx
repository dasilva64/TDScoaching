"use client";

import { AppDispatch } from "../../../redux/store";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./EmailSendTokenData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";

const EmailData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, isLoading, isError } = useUserGet();
  let restDate;
  if (userData?.body.editEmail) {
    let limitDate = userData?.body.editEmail.limitDate;
    let convertInDate = new Date(limitDate);
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());
    restDate = new Date(difference);
  }

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
            {userData?.body.editEmail && (
              <>
                <p>
                  Vous avez déjà fait une demande de changement de mail, vous
                  pouvez refaire une demande dans{" "}
                  {Number(restDate?.getUTCMinutes()) + 1} min{" "}
                </p>
                <button
                  onClick={() => {
                    dispatch({
                      type: "form/openModalEditValidEmailData",
                    });
                  }}
                  className={styles.emailData__div__button}
                >
                  Valider l&apos;addresse {userData?.body.editEmail.newEmail}
                </button>
              </>
            )}
            {!userData?.body.editEmail && (
              <>
              <p>Vous pouvez modifier votre adresse email en cliquant sur le bouton ci-dessous</p>
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
              
            )}
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
