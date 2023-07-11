import React, { useEffect, useState } from "react";
import styles from "./ModalUserSendToken.module.scss";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetchEditSendToken from "../../../../../components/hook/user/useEditEmailSendTokenData";

const ModalUserSendToken = () => {
  const [emailInput, setEmailInput] = useState<string>("emailUser");
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/editEmailSendToken",
    fetchEditSendToken
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        console.log(data);
        const mutateUser = async () => {
          mutate(
            "/api/user/get",
            {
              ...data,
              body: {
                ...data.body,
                editEmail: {
                  newEmail: data.newData.newEmail,
                  limitDate: data.newData.limitDate,
                },
              },
            },
            { revalidate: false }
          );
        };
        mutateUser();
      } else {
      }
    }
  }, [data]);
  const closeForm = () => {
  };
  useEffect(() => {
    if (emailInput && emailInput.length > 0) {
      setValidEmailInput(true);
    }
  }, [emailInput, emailInput.length]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validEmailInput === true) {
      const fetchLogin = async () => {
        trigger({ mail: emailInput });
      };
      fetchLogin();
    } else {
      if (validEmailInput === false) {
        setErrorMessageEmail("Email : doit avoir un format valide");
      }
    }
  };
  return (
    <>
      <div className={styles.modalEditEmailData}>
        <button
          className={styles.modalEditEmailData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditEmailData__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalEditEmailData__h1}>
          Modification de l&apos;addresse mail
        </h1>
        <form
          className={styles.modalEditEmailData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <div className={styles.modalEditEmailData__form__submit}>
            <input
              className={styles.modalEditEmailData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserSendToken;
