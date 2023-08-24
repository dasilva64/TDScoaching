"use client";

import React, { useEffect, useState } from "react";
import styles from "./ModalClosePhone.module.scss";
import { AppDispatch, RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import fetchReSendEmailCode from "@/app/components/fetch/user/useReSendEmail";
import useUserGet from "@/app/components/hook/user/useUserGet";

const ModalClosePhone = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalClosePhone } = useSelector(
    (state: RootState) => state.form
  );
  const { userData, isLoading, isError } = useUserGet();
  let content;
  if (!isError && !isLoading && userData?.body.editEmail) {
    content = <>{userData?.body.editEmail.newEmail}</>;
  }
  const { trigger, data } = useSWRMutation(
    "/api/user/cancelPhone",
    fetchReSendEmailCode
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "form/closeModalClosePhoneAndEditPhoneData",
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
      {displayModalClosePhone === true && (
        <div className={styles.modalClosePhone}>
          <h1 className={styles.modalClosePhone__h1}>
            Êtes-vous sûr de vouloir quitter ?
          </h1>
          <p>
            Vous conserverez votre numéro de téléphone précédent si vous étiez
            en train de la modifier.
          </p>
          <div className={styles.modalClosePhone__reSend}>
            <button
              className={styles.modalClosePhone__reSend__btn}
              onClick={() => {
                dispatch({
                  type: "form/closeModalClosePhone",
                });
              }}
            >
              Continuer
            </button>
            <button
              className={styles.modalClosePhone__reSend__btn}
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

export default ModalClosePhone;
