import React, { useEffect } from "react";
import styles from "./ModalDeleteAccount.module.scss";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import fetchUserDeleteAccount from "@/app/components/fetch/user/fetchDeleteAccount";

const ModalDeleteAccount = () => {
  const dispatch = useDispatch();
  const { data, trigger } = useSWRMutation(
    "/api/user/deleteAccountSendEmail",
    fetchUserDeleteAccount
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: data.message },
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
      type: "form/closeModalDeleteAccount",
    });
  };
  return (
    <>
      <div className={styles.modalDeleteAccount}>
        <button
          className={styles.modalDeleteAccount__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalDeleteAccount__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalDeleteAccount__h1}>Suppression du compte</h1>
        <div className={styles.modalDeleteAccount__div}>
          <div>
            <label htmlFor="">Exemple 1</label>
            <input type="checkbox" name="one" id="" />
          </div>
          <div>
            <label htmlFor="">Exemple 2</label>
            <input type="checkbox" name="two" id="" />
          </div>
          <div>
            <label htmlFor="">Exemple 3</label>
            <input type="checkbox" name="three" id="" />
          </div>
          <div>
            <label htmlFor="">Exemple 4</label>
            <input type="checkbox" name="four" id="" />
          </div>
          <div>
            <label htmlFor="">Autre</label>
            <input type="text" name="five" id="" />
          </div>
          <button
            onClick={() => {
              trigger();
            }}
            className={styles.modalDeleteAccount__btn__delete}
          >
            Supprimer
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalDeleteAccount;
