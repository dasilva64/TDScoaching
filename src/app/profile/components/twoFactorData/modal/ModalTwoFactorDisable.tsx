import { AppDispatch } from "../../../../redux/store";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./ModalTwoFactorUser.module.scss";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetchGet from "@/app/components/fetch/fetchGet";

const ModalTwoFactorDisable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { trigger, data } = useSWRMutation(
    "/api/user/disableTwoFactor",
    fetchGet
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "form/closeModalTwoFactorDisable",
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
  useEffect(() => {
    const mutateMaindataReSendCode = async () => {
      mutate(
        "/api/user/getUserProfile",
        {
          ...data,
          body: {
            ...data.body,
            twoFactor: false,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.status === 200) {
      mutateMaindataReSendCode();
    }
  }, [data]);
  const closeForm = () => {
    dispatch({
      type: "form/closeModalTwoFactorDisable",
    });
  };

  return (
    <>
      <div className={styles.modalTwoFactorUser}>
        <button
          className={styles.modalTwoFactorUser__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalTwoFactorUser__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalTwoFactorUser__h1}>
          Voulez vous vraiment désactiver l&apos;authentification à deux
          facteurs ?
        </h1>
        <div className={styles.modalTwoFactorUser__reSend}>
          <button
            className={styles.modalTwoFactorUser__reSend__btn}
            onClick={() => {
              trigger();
            }}
          >
            Désactiver
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalTwoFactorDisable;
