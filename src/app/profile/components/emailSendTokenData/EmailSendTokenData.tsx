"use client";

import { AppDispatch, RootState } from "../../../redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./EmailSendTokenData.module.scss";
import useUserGet from "../../../components/hook/useUserGet";

const EmailData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {userData} = useUserGet()
  let restDate;
  console.log(userData);
  if (userData?.body.editEmail) {
    let limitDate = userData?.body.editEmail.limitDate;
    let convertInDate = new Date(limitDate);
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());
    restDate = new Date(difference);
  }

  return (
    <>
      <>
        <div className={styles.emailData}>
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
                  pouvez refaire une demande dans {restDate?.getUTCMinutes()}{" "}
                  min{" "}
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
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default EmailData;
