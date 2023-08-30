import fetchCancel from "@/app/components/fetch/paiement/fetchCancel";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import styles from "./ModalDeleteFirstMeeting.module.scss";
import fetchGet from "@/app/components/fetch/user/fetchGet";

const ModalDeleteFirstMeeting = () => {
  const dispatch = useDispatch();
  const { trigger, data } = useSWRMutation(
    "/api/meeting/deleteMeeting",
    fetchGet
  );
  useEffect(() => {
    if (data && data.status === 200) {
      if (data.status === 200) {
        mutate(
          "/api/user/getUser",
          {
            ...data,
            body: {
              ...data.body,
              meeting: data.body.meeting,
              meetings: data.body.meetings,
            },
          },
          { revalidate: false }
        );
        dispatch({
          type: "form/closeModalDeleteFirstMeeting",
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
      type: "form/closeModalDeleteFirstMeeting",
    });
  };
  return (
    <>
      <div className={styles.deleteModal}>
        <button className={styles.deleteModal__btn} onClick={() => closeForm()}>
          <span className={styles.deleteModal__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalDeleteMeeting__modal__h1}>
          Suppression rendez-vous de découverte
        </h1>

        <p>
          Si vous supprimer ce rendez-vous de découverte vous pourrez en
          reprendre un autre.
        </p>
        <div className={styles.deleteModal__div}>
          <button
            className={styles.deleteModal__div__btn}
            onClick={() => {
              const fetchDeleteeeting = async () => {
                trigger();
              };
              fetchDeleteeeting();
            }}
          >
            Supprimer ce rendez-vous
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalDeleteFirstMeeting;
