import React, { useEffect, useState } from "react";
import styles from "./ModalUserSendToken.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import GroupForm from "@/app/components/form/group";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetchEditSendToken from "@/app/components/hook/user/useEditEmailSendTokenData";

const ModalUserSendToken = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { emailUser } = useSelector((state: RootState) => state.auth);
  const [emailInput, setEmailInput] = useState<string>(emailUser);
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
        dispatch({
          type: "form/openModalEditEmailData",
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
      type: "form/closeModalEditEmailSendData",
    });
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
          <GroupForm
            nameLabel={"Email"}
            typeInput={"text"}
            nameInput={"email"}
            errorMessageInput={"Email : doit avoir un format valide"}
            regex={/^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/}
            inputValue={emailInput}
            setInputValue={setEmailInput}
            setValidInput={setValidEmailInput}
            errorMessage={errorMessageEmail}
            setErrorMessage={setErrorMessageEmail}
          />
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
