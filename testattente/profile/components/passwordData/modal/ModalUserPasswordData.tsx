import React, { useEffect, useState } from "react";
import styles from "./ModalUserPasswordData.module.scss";
import fetchEditPasswordData from "../../../../../components/hook/user/useEditPasswordData";
import useSWRMutation from "swr/mutation";

const ModalUserPasswordData = () => {
  const [passwordInput, setPasswordInput] = useState<string>(
    ""
  );
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>(
    ""
  );
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");
  const [errorMessagePasswordComfirm, setErrorMessagePasswordComfirm] =
    useState<string>("");

  const {trigger, data} = useSWRMutation('http://localhost:8080/user/editPassword', fetchEditPasswordData)


  useEffect(() => {
    if (data) {
      if (data.status === 200) {
      } else {
      }
    }
  }, [data]);

  const closeForm = () => {
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validPasswordInput === true || validPasswordComfirmInput === true) {
      if (passwordInput === passwordComfirmInput) {
        const fetchLogin = async () => {
          trigger({password: passwordInput})
        };
        fetchLogin();
      } else {
        setValidPasswordInput(false);
        setValidPasswordComfirmInput(false);
        setErrorMessagePasswordComfirm(
            "Comfirmation mot de passe : les mots de passe sont identiques"
          );
      }
    } else {
      if (validPasswordInput === false) {
        setErrorMessagePassword("Mot de passe : ne doit pas être vide");
      }
      if (validPasswordComfirmInput === false) {
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : ne doit pas être vide"
        );
      }
    }
  };
  return (
    <>
      <div className={styles.modalEditPasswordData}>
        <button
          className={styles.modalEditPasswordData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditPasswordData__btn__cross}>
            &times;
          </span>
        </button>
        <h1 className={styles.modalEditPasswordData__h1}>
          Modification des informations principales
        </h1>
        <form
          className={styles.modalEditPasswordData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <div className={styles.modalEditPasswordData__form__submit}>
            <input
              className={styles.modalEditPasswordData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserPasswordData;
