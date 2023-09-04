import React, { useEffect } from "react";
import styles from "./ModalDeleteMeeting.module.scss";
import useSWRMutation from "swr/mutation";
import { useDispatch } from "react-redux";
import { mutate } from "swr";
import fetchGet from "@/app/components/fetch/fetchGet";

const ModalDeleteMeeting = () => {
  const dispatch = useDispatch();
  const { trigger, data } = useSWRMutation("/api/paiement/cancel", fetchGet);
  useEffect(() => {
    if (data && data.status === 200) {
      if (data.status === 200) {
        mutate("/api/user/getUserMeeting", {
          ...data,
        });
        dispatch({
          type: "form/closeModalDeleteMeeting",
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
  const closeForm = () => {
    dispatch({
      type: "form/closeModalDeleteMeeting",
    });
  };
  return (
    <>
      <div className={styles.deleteModal}>
        <button className={styles.deleteModal__btn} onClick={() => closeForm()}>
          <span className={styles.deleteModal__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalDeleteMeeting__modal__h1}>
          Voulez vous vraiment supprimer ce rendez-vous
        </h1>

        <p>
          Si vous supprimer ce rendez-vous le paiement que vous avez effectué ne
          sera pas validé et aucun argent ne sera débité de votre compte.
        </p>
        <div className={styles.deleteModal__div}>
          <button
            className={styles.deleteModal__div__btn}
            onClick={() => {
              const fetchAddMeeting = async () => {
                trigger();
              };
              fetchAddMeeting();
            }}
          >
            Suppression
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalDeleteMeeting;
