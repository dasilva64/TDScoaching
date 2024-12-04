import React, { useEffect, useState } from "react";
import styles from "./Forgot.module.scss";
import { AppDispatch, RootState } from "../../../../src/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import fetchPost from "../fetch/FetchPost";
import Input from "../input/Input";
import TabIndex from "../tabIndex/TabIndex";

const Forgot = () => {
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [validInputEmail, setValidInputEmail] = useState<boolean>(false);
  const [inputEmailError, setInputEmailError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { displayModalForgot } = useSelector(
    (state: RootState) => state.ModalForgot
  );
  const { data, trigger, reset } = useSWRMutation(
    "/components/forgot/api/forgot",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({ type: "ModalForgot/close" });
        clearState();

        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        reset();
      } else if (data.status === 400) {
        setTimeout(() => {
          setIsLoading(false);
          data.message.forEach((element: string) => {
            if (element[0] === "email") {
              setInputEmailError(element[1]);
            }
          });
          reset();
        }, 2000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }, 2000);
      }
    }
  }, [data, dispatch, reset]);
  const clearState = () => {
    setInputPseudo("");
    setInputEmail("");
    setValidInputEmail(false);
    setInputEmailError("");
    setIsLoading(false);
  };

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validInputEmail === true) {
      if (inputPseudo.length === 0) {
        setIsLoading(true);
        const fetchApi = async () => {
          trigger({
            email: validator.escape(inputEmail.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchApi();
      }
    } else {
      if (validInputEmail === false) {
        setInputEmailError("Email : doit avoir un format valide");
      }
    }
  };

  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      <TabIndex displayModal={displayModalForgot} />
      <AnimatePresence>
        {displayModalForgot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => {
                clearState();
                dispatch({
                  type: "ModalForgot/close",
                });
              }}
            />
            <motion.div
              className={styles.forgot}
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
              <div className={styles.forgot__top}>
                <button
                  type="button"
                  className={styles.forgot__top__back}
                  onClick={() => {
                    clearState();
                    dispatch({ type: "ModalForgot/close" });
                    dispatch({ type: "ModalLogin/open" });
                  }}
                >
                  Retour à la connection
                </button>
                <button
                  className={styles.forgot__top__close}
                  type="button"
                  onClick={() => {
                    clearState();
                    dispatch({
                      type: "ModalForgot/close",
                    });
                  }}
                >
                  <Image
                    className={styles.forgot__top__close__img}
                    src="/assets/icone/xmark-solid.svg"
                    alt="icone fermer modal"
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </div>
              <h2 className={`${styles.forgot__h1}`}>
                Réinitialisation du mot de passe
              </h2>

              <form
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
                className={styles.forgot__form}
              >
                <Input
                  label={"Email"}
                  value={inputEmail}
                  id={"email"}
                  type={"text"}
                  placeholder={"Entrez votre mail"}
                  regex={/^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInput(
                      e,
                      /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                      setValidInputEmail,
                      setInputEmailError,
                      setInputEmail,
                      "Email : ne peut pas être vide"
                    );
                  }}
                  validInput={validInputEmail}
                  errorMessage={inputEmailError}
                  image={"at-solid"}
                  alt={"icone email"}
                  position={"first"}
                  tab={true}
                />
                <input
                  type="text"
                  name="pseudo"
                  style={{ display: "none" }}
                  id="pseudo"
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <div className={styles.forgot__form__submit}>
                  {isLoading === false && (
                    <input
                      className={styles.forgot__form__submit__btn}
                      type="submit"
                      value="Récupérer son mot de passe"
                    />
                  )}

                  {isLoading === true && (
                    <button
                      disabled
                      className={styles.forgot__form__submit__btn__load}
                    >
                      <span
                        className={styles.forgot__form__submit__btn__load__span}
                      >
                        Chargement
                      </span>

                      <div
                        className={styles.forgot__form__submit__btn__load__arc}
                      >
                        <div
                          className={
                            styles.forgot__form__submit__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
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

export default Forgot;
