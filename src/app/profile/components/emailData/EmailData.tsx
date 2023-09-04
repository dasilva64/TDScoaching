"use client";

import React, { useEffect, useState } from "react";
import styles from "./EmailData.module.scss";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";
import fetchPost from "@/app/components/fetch/FetchPost";
import fetchGet from "@/app/components/fetch/fetchGet";
import useGet from "@/app/components/hook/useGet";

const EmailCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalCloseEmail } = useSelector(
    (state: RootState) => state.form
  );
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserProfile");
  let content;
  if (!isError && !isLoading && userData?.body.editEmail) {
    content = <>{userData?.body.editEmail.newEmail}</>;
  }

  const [codeInput, setCodeInput] = useState<string>("");
  const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
  const [errorMessageCode, setErrorMessageCode] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/editEmailUser",
    fetchPost
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
      let copyNewEmail = data.body.mail;
      mutate(
        "/api/user/getUserProfile",
        {
          ...data,
          body: {
            ...data.body,
            email: copyNewEmail,
            editEmail: null,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.status === 200) {
      mutateMainData();
    }
  }, [data]);
  const closeForm = () => {
    dispatch({
      type: "form/openModalCloseEmail",
    });
  };
  const { trigger: triggerReSendCode, data: dataReSendCode } = useSWRMutation(
    "/api/user/emailReSendCode",
    fetchGet
  );
  useEffect(() => {
    if (dataReSendCode) {
      if (dataReSendCode.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataReSendCode.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataReSendCode.message },
        });
      }
    }
  }, [dataReSendCode, dispatch]);
  useEffect(() => {
    const mutateMaindataReSendCode = async () => {
      let copyNewEmail = dataReSendCode.body.editEmail;
      mutate(
        "/api/user/getUserProfile",
        {
          ...dataReSendCode,
          body: {
            ...dataReSendCode.body,
            editEmail: copyNewEmail,
          },
        },
        { revalidate: false }
      );
    };
    if (dataReSendCode && dataReSendCode.status === 200) {
      mutateMaindataReSendCode();
    }
  }, [dataReSendCode]);
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
  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
    regex: RegExp,
    setValidInput: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string
  ) => {
    setInput(e.target.value);
    if (regex.test(e.target.value)) {
      setValidInput(true);
      setErrorMessage("");
    } else if (e.target.value.length === 0) {
      setValidInput(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setErrorMessage(errorMessage);
    }
  };
  return (
    <>
      <div className={styles.bg}></div>
      <div
        className={`${styles.modalEditEmailSendData} ${
          displayModalCloseEmail === true
            ? styles.modalEditEmailSendData__opacity
            : null
        }`}
      >
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
          Validation de votre nouvel email {content}
        </h1>
        <p>
          Afin de renforcer la sécurité de vos données et de vos documents, nous
          devons vérifier votre adresse email. Nous vous avons envoyé un email
          contenant un code de sécurité à 8 chiffres.
        </p>
        <form
          className={styles.modalEditEmailSendData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <TextField
            value={codeInput}
            style={{ margin: "20px 0px 30px 0px" }}
            id={"code"}
            label={"Code de validation"}
            variant="standard"
            type={"number"}
            placeholder={"Entrez votre code"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                "firstname",
                /^[0-9]{8,8}$/,
                setValidCodeInput,
                setErrorMessageCode,
                setCodeInput,
                "Code : doit contenir 8 chiffres"
              );
            }}
            helperText={errorMessageCode}
          />
          <div className={styles.modalEditEmailSendData__form__submit}>
            <input
              className={styles.modalEditEmailSendData__form__submit__btn}
              type="submit"
              value="Valider votre mail"
            />
          </div>
        </form>
        <div className={styles.modalEditEmailSendData__reSend}>
          <button
            className={styles.modalEditEmailSendData__reSend__btn}
            onClick={() => {
              triggerReSendCode();
            }}
          >
            Renvoyer un code
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailCheck;
