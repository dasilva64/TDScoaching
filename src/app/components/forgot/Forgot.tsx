import React, { useEffect, useState } from "react";
import styles from "./Forgot.module.scss";
import { AppDispatch, RootState } from "../../../../src/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Image from "../image/Image";
import useSWRMutation from "swr/mutation";
import fetchPost from "../fetch/FetchPost";
import Input from "../input/Input";
import TabIndex from "../tabIndex/TabIndex";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

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
  const router = useRouter()
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
        mutate('/components/header/api')
        reset();
      } else if (data.status === 400) {
        setTimeout(() => {
          setIsLoading(false);
          setInputEmail("")
          data.message.forEach((element: string) => {
            if (element[0] === "email") {
              setInputEmailError(element[1]);
            }
          });
          reset();
        }, 2000);
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        router.push("/");
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setInputEmail("")
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
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)

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
            email: inputEmail.trim(),
            pseudo: inputPseudo.trim(),
            csrfToken: csrfToken
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
  const backLogin = async () => {
    clearState();
    await dispatch({ type: "ModalForgot/close" });
    await dispatch({ type: "ModalLogin/open" });
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
                    backLogin();
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
                action=""
                method="POST"
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
                className={styles.forgot__form}
              >
                <Input
                  label={"Email"}
                  value={inputEmail}
                  id={"emailForgot"}
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
                  className={styles.forgot__form__hidden}
                  type="text"
                  name="pseudo"
                  /* style={{ display: "none" }} */
                  id="pseudoForgot"
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
