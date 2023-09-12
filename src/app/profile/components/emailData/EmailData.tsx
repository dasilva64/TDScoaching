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
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const EmailCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalEditEmail } = useSelector(
    (state: RootState) => state.ModalEditEmail
  );
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/api/user/getUserProfile");
  /* if (!isError && !isLoading && userData?.body.editEmail) {
    content = <>{userData?.body.editEmail.newEmail}</>;
  } */
  let content;
  if (isLoading) {
    content = <></>;
  } else {
    if (userData) {
      if (userData.status === 200) {
        content = <>{userData.body.newEmail}</>;
      } else {
        content = <></>;
      }
    }
  }

  const [codeInput, setCodeInput] = useState<string>("");
  const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
  const [errorMessageCode, setErrorMessageCode] = useState<string>("");
  const clearState = () => {
    setCodeInput("");
    setValidCodeInput(false);
    setErrorMessageCode("");
  };
  const { trigger, data, reset } = useSWRMutation(
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
          type: "ModalEditEmail/close",
        });
        clearState();
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
      reset();
    };
    if (data && data.status === 200) {
      mutateMainData();
    }
  }, [data, mutate, reset]);
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalCancelEmail/open",
    });
  };
  const {
    trigger: triggerReSendCode,
    data: dataReSendCode,
    reset: resetReSendCode,
  } = useSWRMutation("/api/user/emailReSendCode", fetchGet);
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
        {
          ...dataReSendCode,
          body: {
            ...dataReSendCode.body,
            editEmail: copyNewEmail,
          },
        },
        { revalidate: false }
      );
      resetReSendCode();
    };
    if (dataReSendCode && dataReSendCode.status === 200) {
      mutateMaindataReSendCode();
    }
  }, [dataReSendCode, mutate, resetReSendCode]);
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
      <AnimatePresence>
        {displayModalEditEmail === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalEditEmailSendData}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: "-50%",
                x: "-50%",
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: 200,
                x: "-50%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <button
                className={styles.modalEditEmailSendData__btn}
                onClick={() => {
                  closeForm();
                }}
              >
                <Image
                  className={styles.modalEditEmailSendData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalEditEmailSendData__h1}>
                Validation de votre nouvel email {content}
              </h1>
              <p>
                Afin de renforcer la sécurité de vos données et de vos
                documents, nous devons vérifier votre adresse email. Nous vous
                avons envoyé un email contenant un code de sécurité à 8
                chiffres.
              </p>
              <form
                className={styles.modalEditEmailSendData__form}
                action=""
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <TextField
                  autoFocus
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmailCheck;
