"use client";

import React, { useEffect, useState } from "react";
import styles from "./EmailData.module.scss";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import fetchPost from "@/app/components/fetch/FetchPost";
import fetchGet from "@/app/components/fetch/fetchGet";
import KeyIcon from "@mui/icons-material/Key";
import useGet from "@/app/components/hook/useGet";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

const EmailCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const { displayModalEditEmail } = useSelector(
    (state: RootState) => state.ModalEditEmail
  );
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/api/user/getUserProfile");
  let content;
  if (isLoading) {
    content = <></>;
  } else {
    if (userData) {
      if (userData.status === 200) {
        content = <>{userData.body.newEmail}</>;
      } else if (userData.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: userData.message,
          },
        });
        router.push("/");
      } else {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: {
              type: "error",
              flashMessage: userData.message,
            },
          });
        }, 2000);
        router.refresh();
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
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/api/user/editEmailUser",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        //if (isMutating === false) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalEditEmail/close",
        });
        clearState();
        mutate(
          {
            ...data,
          },
          { revalidate: false }
        );
        reset();
        //}
      } else if (data.status === 401) {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }, 2000);
        router.push("/");
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "code") {
              setErrorMessageCode(element[1]);
            }
          });
          reset();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, isMutating, mutate, reset, router]);
  /* 
  useEffect(() => {
    const mutateMainData = async () => {
      let copyNewEmail = data.body.mail;
      mutate(
        {
          ...data,
        },
        { revalidate: false }
      );
      reset();
    };
    if (data && data.status === 200) {
      mutateMainData();
    }
  }, [data, mutate, reset]); */
  const closeForm = () => {
    dispatch({
      type: "flash/clearFlashMessage",
    });
    //clearState();
    dispatch({
      type: "ModalCancelEmail/open",
    });
  };
  const {
    trigger: triggerReSendCode,
    data: dataReSendCode,
    reset: resetReSendCode,
    isMutating: isMutatingReSendCode,
  } = useSWRMutation("/api/user/emailReSendCode", fetchGet);
  useEffect(() => {
    if (dataReSendCode) {
      if (dataReSendCode.status === 200) {
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
        if (isMutatingReSendCode === false) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: dataReSendCode.message },
          });
        }
      } else if (dataReSendCode.status === 401) {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: dataReSendCode.message },
          });
          resetReSendCode();
        }, 2000);
        router.push("/");
      } else if (dataReSendCode.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataReSendCode.message },
        });
        resetReSendCode();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataReSendCode.message },
        });
        resetReSendCode();
      }
    }
  }, [
    dataReSendCode,
    dispatch,
    isMutatingReSendCode,
    mutate,
    resetReSendCode,
    router,
  ]);
  /* useEffect(() => {
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
  }, [dataReSendCode, mutate, resetReSendCode]); */
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validCodeInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({ code: codeInput, pseudo: inputPseudo });
        };
        fetchLogin();
      }
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
                <FormControl
                  variant="standard"
                  style={{ margin: "20px 0px 30px 0px" }}
                >
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-code"
                  >
                    Code de validation
                  </InputLabel>
                  <Input
                    autoFocus
                    id="standard-adornment-code"
                    value={codeInput}
                    placeholder={"Entrez votre code"}
                    type={"text"}
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
                    endAdornment={
                      <InputAdornment position="end">
                        <KeyIcon
                          aria-label="toggle code visibility"
                          sx={{ padding: "0px", color: "black" }}
                        >
                          <Visibility />
                        </KeyIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errorMessageCode}
                  </FormHelperText>
                </FormControl>
                {/* <TextField
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
                /> */}
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <div className={styles.modalEditEmailSendData__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        className={
                          styles.modalEditEmailSendData__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalEditEmailSendData__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalEditEmailSendData__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalEditEmailSendData__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <input
                        className={
                          styles.modalEditEmailSendData__form__submit__btn
                        }
                        type="submit"
                        value="Valider votre mail"
                      />
                    </>
                  )}
                </div>
              </form>
              <div className={styles.modalEditEmailSendData__reSend}>
                {isMutatingReSendCode && (
                  <>
                    <button
                      disabled
                      className={
                        styles.modalEditEmailSendData__reSend__btn__load
                      }
                    >
                      <span
                        className={
                          styles.modalEditEmailSendData__reSend__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.modalEditEmailSendData__reSend__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.modalEditEmailSendData__reSend__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  </>
                )}
                {isMutatingReSendCode === false && (
                  <>
                    <button
                      className={styles.modalEditEmailSendData__reSend__btn}
                      onClick={() => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        clearState();
                        triggerReSendCode();
                      }}
                    >
                      Renvoyer un code
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmailCheck;
