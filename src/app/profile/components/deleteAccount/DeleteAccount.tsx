"use client";

import React from "react";
import styles from "./DeleteAccount.module.scss";
import { useDispatch } from "react-redux";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.deleteAccount}>
        <h3 className={styles.deleteAccount__h3}>Suppression du compte</h3>
        <p>
          Vous pouvez supprimer votre compte ici mais cette action sera
          définitive
        </p>
        <div className={styles.deleteAccount__div}>
          <button
            onClick={() => {
              dispatch({
                type: "form/openModalDeleteAccount",
              });
            }}
            className={styles.deleteAccount__div__button}
          >
            supprimer mon compte
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteAccount;
