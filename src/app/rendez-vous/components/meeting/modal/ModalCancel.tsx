import React, { useDebugValue, useEffect } from "react";
import styles from "./ModalCancel.module.scss";
import fetchCancel from "@/app/components/fetch/paiement/fetchCancel";
import useSWRMutation from "swr/mutation";
import { useDispatch } from "react-redux";
import { mutate } from "swr";

const ModalCancel = () => {
  const dispatch = useDispatch();
  const { trigger, data } = useSWRMutation("/api/paiement/cancel", fetchCancel);
  console.log(data);
  useEffect(() => {
    if (data && data.status === 200) {
      if (data.status === 200) {
        dispatch({
          type: "form/closeModalCancelMeeting",
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
    if (data && data.status === 200) {
      const test = async () => {
        await mutate("/api/user/getUser");
      };
      test();
    }
  }, [data]);
  const closeForm = () => {
    dispatch({
      type: "form/closeModalCancelMeeting",
    });
  };
  return (
    <>
      <div className={styles.cancelModal}>
        <button className={styles.cancelModal__btn} onClick={() => closeForm()}>
          <span className={styles.cancelModal__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.cancelModal__h1}>
          Comfirmation annulation rendez-vous
        </h1>
        <div className={styles.cancelModal__forgot}>
          <button
            className={styles.cancelModal__forgot__btn}
            onClick={() => {
              const fetchCancelMeeting = async () => {
                trigger();
              };
              fetchCancelMeeting();
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalCancel;
