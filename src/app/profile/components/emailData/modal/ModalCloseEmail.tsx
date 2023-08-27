"use client";

import React, { useEffect, useState } from "react";
import styles from "./ModalCloseEmail.module.scss";
import { AppDispatch, RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import useUserGet from "@/app/components/hook/user/useUserGet";
import fetchGet from "@/app/components/fetch/user/fetchGet";

const ModalCloseEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalCloseEmail } = useSelector(
    (state: RootState) => state.form
  );
  const { userData, isLoading, isError } = useUserGet();
  let content;
  if (!isError && !isLoading && userData?.body.editEmail) {
    content = <>{userData?.body.editEmail.newEmail}</>;
  }
  const { trigger, data } = useSWRMutation("/api/user/cancelEmail", fetchGet);

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "form/closeModalCloseEmailAndEditEmailData",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch]);

  return (
    <>
      {displayModalCloseEmail === true && (
        <div className={styles.modalCloseEmail}>
          <h1 className={styles.modalCloseEmail__h1}>
            Êtes-vous sûr de vouloir quitter ?
          </h1>
          <p>
            Vous conserverez votre adresse e-mail précédente si vous étiez en
            train de la modifier.
          </p>
          <div className={styles.modalCloseEmail__reSend}>
            <button
              className={styles.modalCloseEmail__reSend__btn}
              onClick={() => {
                dispatch({
                  type: "form/closeModalCloseEmail",
                });
              }}
            >
              Continuer
            </button>
            <button
              className={styles.modalCloseEmail__reSend__btn}
              onClick={() => {
                trigger();
              }}
            >
              Quitter
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCloseEmail;
