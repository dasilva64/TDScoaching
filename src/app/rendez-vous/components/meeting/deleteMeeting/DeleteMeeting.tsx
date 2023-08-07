import React from "react";
import styles from "./DeleteMeeting.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";

const DeleteMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <div className={styles.modalDeleteMeeting__div}>
        <div>
          <button
            className={styles.modalDeleteMeeting__div__btn__delete}
            onClick={() => {
              dispatch({
                type: "form/openModalDeleteMeeting",
              });
            }}
          >
            Supprimer votre rendez-vous
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteMeeting;
