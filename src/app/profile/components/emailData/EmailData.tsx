"use client";

import React, { useEffect, useState } from "react";
import styles from "./EmailData.module.scss";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import fetchPost from "../../../components/fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";
import Image from "@/app/components/image/Image";
import { useRouter } from "next/navigation";
import Input from "@/app/components/input/Input";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store";

const EmailCheck = ({ data: userData, mutate }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { csrfToken } = useSelector(
    (state: RootState) => state.csrfToken
  );
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const { displayModalEditEmail } = useSelector(
    (state: RootState) => state.ModalEditEmail
  );
  console.log('displayModalEditEmail', displayModalEditEmail)
  /* const {
    data: userData,
    isLoading,
    mutate,
  } = useGet("/profile/components/api"); */

  /* let content;
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
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: userData.message,
          },
        });
        router.push("/");
      }
    }
  } */

  const [codeInput, setCodeInput] = useState<string>("");
  const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
  const [errorMessageCode, setErrorMessageCode] = useState<string>("");
  const clearState = () => {
    setCodeInput("");
    setValidCodeInput(false);
    setErrorMessageCode("");
  };
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/emailData/api",
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
        dispatch({
          type: "csrfToken/store",
          payload: { csrfToken: data.csrfToken },
        });
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
    clearState();
    dispatch({
      type: "ModalCancelEmail/open",
    });
  };
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validCodeInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({ code: codeInput, pseudo: inputPseudo, csrfToken: csrfToken });
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
      <TabIndex displayModal={displayModalEditEmail} />
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
                type="button"
                className={styles.modalEditEmailSendData__btn}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  closeForm();
                }}
              >
                <Image
                  className={styles.modalEditEmailSendData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalEditEmailSendData__h1}`}>
                Validation de votre nouvel email {userData.body.newEmail}
              </h2>
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
                <Input
                  label={"Code de validation"}
                  value={codeInput}
                  id={"code"}
                  type={"text"}
                  placeholder={"Entrez votre code de validation"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                  validInput={validCodeInput}
                  errorMessage={errorMessageCode}
                  image={"lock-solid"}
                  alt={"icone code"}
                  position={"first"}
                  tab={true}
                />

                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalEditEmailSendData__form__hidden}
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
                        disabled
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmailCheck;
