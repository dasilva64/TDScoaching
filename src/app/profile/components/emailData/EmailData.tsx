"use client";

import React, { useEffect, useState } from "react";
import styles from "./EmailData.module.scss";
import useUser from "../../../components/hook/useUserGetRole";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import useEditEmailData from "../../../components/hook/user/useEditEmailData";
import GroupForm from "../../../components/form/group";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import fetchEditEmailData from "../../../components/hook/user/useEditEmailData";

const EmailCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalEditEmailData } = useSelector(
    (state: RootState) => state.form
  );
  const { isLog } = useSelector((state: RootState) => state.auth);
  //const { user, isLoading, isError, mutate } = useUser();

  const [codeInput, setCodeInput] = useState<string>("");
  const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
  const [errorMessageCode, setErrorMessageCode] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/editEmail",
    fetchEditEmailData
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalEditEmailData",
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
    const mutateMainData = async () => {
      mutate(
        "/api/user/get",
        {
          ...data,
          body: {
            ...data.body,
            editEmail: null,
          },
        },
        { revalidate: false }
      );
    };
    if (data) {
      mutateMainData();
    }
  }, [data]);
  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditEmailData",
    });
  };
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validCodeInput === true) {
      const fetchLogin = async () => {
        trigger({ code: codeInput });
      };
      fetchLogin();
    } else {
      if (validCodeInput === false) {
        setErrorMessageCode("Code : doit contenir 8 chiffres");
      }
    }
  };
  return (
    <>
      {displayModalEditEmailData === true && (
        <div className={styles.modalEditEmailSendData}>
          <button
            className={styles.modalEditEmailSendData__btn}
            onClick={() => {
              closeForm();
            }}
          >
            <span className={styles.modalEditEmailSendData__btn__cross}>
              &times;
            </span>
          </button>
          <h1 className={styles.modalEditEmailSendData__h1}>
            Validation de votre email
          </h1>
          <form
            className={styles.modalEditEmailSendData__form}
            action=""
            onSubmit={(e) => {
              handlerSubmit(e);
            }}
          >
            <GroupForm
              nameLabel={"Code"}
              typeInput={"number"}
              nameInput={"code"}
              errorMessageInput={"Code : doit contenir 8 chiffres"}
              regex={/[0-9]{8,8}/}
              inputValue={codeInput}
              setInputValue={setCodeInput}
              setValidInput={setValidCodeInput}
              errorMessage={errorMessageCode}
              setErrorMessage={setErrorMessageCode}
            />
            <div className={styles.modalEditEmailSendData__form__submit}>
              <input
                className={styles.modalEditEmailSendData__form__submit__btn}
                type="submit"
                value="Valider votre mail"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EmailCheck;
