import React, { useEffect } from "react";
import styles from "./ModalCancelFormuleUser.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import fetchGet from "@/app/components/fetch/user/fetchGet";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";

const ModalCancelFormuleUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const closeForm = () => {
    dispatch({
      type: "form/closeModalCancelFormuleUserData",
    });
  };
  const { trigger, data } = useSWRMutation(
    "/api/user/cancelFormuleUser",
    fetchGet
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate(
          "/api/user/getUser",
          {
            ...data,
            body: {
              ...data.body,
              typeMeeting: { type: "découverte" },
            },
          },
          { revalidate: false }
        );
        dispatch({
          type: "form/closeModalCancelFormuleUserData",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else if (data.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
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
      <div className={styles.modalComfirm}>
        <button
          className={styles.modalComfirm__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalComfirm__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalComfirm__h1}>
          Annuler d&apos;offre en cours
        </h1>
        <p>
          Si vous decidez de d&apos;annuler l&apos;offre en cours, une parti de
          l&apos;argent vous sera remboursé
        </p>
        <p>
          Vous pouvez annuler votre offre en cliquant sur le bouton ci-dessous
        </p>
        <button
          className={styles.modalComfirm__btn__cancel}
          onClick={() => {
            trigger();
          }}
        >
          Annuler d&apos;offre
        </button>
      </div>
    </>
  );
};

export default ModalCancelFormuleUser;
