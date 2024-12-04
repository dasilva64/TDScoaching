import React, { useEffect, useState } from "react";
import styles from "./FormLogin.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../src/app/redux/store";
import validator from "validator";
import useSWRMutation from "swr/mutation";
import fetchPost from "../fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { mutate } from "swr";
import Input from "../input/Input";
import TabIndex from "../tabIndex/TabIndex";

const FormLogin = () => {
  const { displayModalLogin } = useSelector(
    (state: RootState) => state.ModalLogin
  );
  const inputRef: any = React.useRef();
  useEffect(() => {
    if (displayModalLogin === true) {
      if (inputRef && inputRef.current) {
        inputRef.current.addEventListener("keydown", (e: any) => {
          if (e.key === "Enter") {
            e.srcElement.click();
            e.preventDefault();
          }
        });
      }
    }
  }, [displayModalLogin]);
  const dispatch = useDispatch<AppDispatch>();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [rememberMeInput, setRememberMeInput] = useState<boolean>(false);
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState<string>("");
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");
  const [displayInput, setDisplayInput] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlerInputRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMeInput(e.target.checked);
  };

  const clearState = () => {
    setDisplayInput(false);
    setInputPseudo("");
    setEmailInput("");
    setIsLoading(false);
    setPasswordInput("");
    setRememberMeInput(false);
    setValidEmailInput(false);
    setValidPasswordInput(false);
    setErrorMessageEmail("");
    setErrorMessagePassword("");
  };

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalLogin/close",
    });
  };

  const {
    trigger: login,
    data: loginData,
    reset: resetLogin,
  } = useSWRMutation("/components/login/api/login", fetchPost);
  useEffect(() => {
    if (loginData) {
      if (loginData.status === 200) {
        mutate("/components/header/api");
        clearState();
        dispatch({
          type: "ModalLogin/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: loginData.message },
        });
        resetLogin();
      } else if (loginData.status === 400) {
        if (loginData.type === "validation") {
          setTimeout(() => {
            setIsLoading(false);
            setPasswordInput("");
            setValidPasswordInput(false);
            loginData.message.forEach((element: string) => {
              if (element[0] === "email") {
                setErrorMessageEmail(element[1]);
              }
              if (element[0] === "password") {
                setErrorMessagePassword(element[1]);
              }
            });
            resetLogin();
          }, 1000);
        } else {
          if (
            loginData.message ===
            "Votre compte a été supprimé car vous ne l'avez pas validé à temps, veuillez vous réinscrire"
          ) {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: loginData.message },
            });
            setTimeout(() => {
              setPasswordInput("");
              setValidPasswordInput(false);
              setIsLoading(false);
              clearState();

              dispatch({ type: "ModalLogin/close" });
              dispatch({ type: "ModalRegister/open" });
              resetLogin();
            }, 1000);
          } else {
            setTimeout(() => {
              setIsLoading(false);
              setPasswordInput("");
              setValidPasswordInput(false);
              dispatch({
                type: "flash/storeFlashMessage",
                payload: { type: "error", flashMessage: loginData.message },
              });
              resetLogin();
            }, 1000);
          }
        }
      }
    }
  }, [dispatch, emailInput, loginData, resetLogin]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validEmailInput === true && validPasswordInput === true) {
      if (inputPseudo.length === 0) {
        setIsLoading(true);
        const fetchLogin = async () => {
          login({
            email: validator.escape(emailInput.trim()),
            password: validator.escape(passwordInput.trim()),
            remember: rememberMeInput,
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        if (inputPseudo.length === 0) {
          fetchLogin();
        }
      }
    } else {
      if (emailInput.length === 0) {
        setErrorMessageEmail("Email : ne peut pas être vide");
      } else {
        setErrorMessageEmail("");
      }

      if (validPasswordInput === false) {
        if (passwordInput.length === 0) {
          setErrorMessagePassword("Mot de passe : ne peut pas être vide");
        }
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
    let removeSpace = "";
    if (e.target.value.charAt(0) === " ") {
      removeSpace = e.target.value.replace(/\s/, "");
      setInput(removeSpace);
    } else {
      removeSpace = e.target.value.replace(/\s\s+/g, " ");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      setValidInput(true);
      setErrorMessage("");
    } else if (removeSpace.length === 0) {
      setValidInput(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setErrorMessage(errorMessage);
    }
  };
  return (
    <>
      <TabIndex displayModal={displayModalLogin} />
      <AnimatePresence>
        {displayModalLogin === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.login}
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
                className={styles.login__btn}
                type="button"
                onClick={() => closeForm()}
                aria-label="button pour fermer la modal de connexion"
              >
                <Image
                  className={styles.login__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.login__h1}`}>Se connecter</h2>
              {displayInput === false && (
                <form
                  className={styles.login__form}
                  onSubmit={(e) => {
                    if (isLoading === false) {
                      handlerSubmit(e);
                    } else {
                      e.preventDefault();
                    }
                  }}
                >
                  <Input
                    label={"Email"}
                    value={emailInput}
                    id={"email"}
                    type={"text"}
                    placeholder={"Entrez votre mail"}
                    regex={/^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/}
                    onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handlerInput(
                        e,
                        "firstname",
                        /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                        setValidEmailInput,
                        setErrorMessageEmail,
                        setEmailInput,
                        "Email : doit avoir le format email@mail.com"
                      );
                    }}
                    validInput={validEmailInput}
                    errorMessage={errorMessageEmail}
                    image={"at-solid"}
                    alt={"icone utilisateur"}
                    position={"first"}
                    tab={true}
                  />
                  <Input
                    label={"Mot de passe"}
                    value={passwordInput}
                    id={"password"}
                    type={"password"}
                    placeholder={"Entrez votre mot de passe"}
                    regex={
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#=&,_])[A-Za-z\d-?!*:@~%.;+|$#=&,_]{8,}$/
                    }
                    onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handlerInput(
                        e,
                        "password",
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#=&,_])[A-Za-z\d-?!*:@~%.;+|$#=&,_]{8,}$/,
                        setValidPasswordInput,
                        setErrorMessagePassword,
                        setPasswordInput,
                        "Mot de passe : doit avoir une lettre en minuscule, majuscule, un nombre, un caractère spécial (-?!*:@~%.;+|$#=&,_) et 8 caractères minimum"
                      );
                    }}
                    validInput={validPasswordInput}
                    errorMessage={errorMessagePassword}
                    image={"eye-solid"}
                    alt={"icone afficher mot de passe"}
                    tab={true}
                  />

                  <div className={styles.login__form__div}>
                    <label
                      className={styles.login__form__div__label}
                      htmlFor="remenber"
                    >
                      Se souvenir de moi
                    </label>
                    <input
                      ref={inputRef}
                      tabIndex={0}
                      className={styles.login__form__div__checkbox}
                      type="checkbox"
                      name="remenber"
                      id="remenber"
                      onChange={(e) => {
                        handlerInputRememberMe(e);
                      }}
                    />
                  </div>
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
                  <div className={styles.login__form__submit}>
                    {isLoading === false && (
                      <input
                        className={styles.login__form__submit__btn}
                        type="submit"
                        value="Se connecter"
                      />
                    )}
                    {isLoading === true && (
                      <button
                        disabled
                        className={styles.login__form__submit__btn__load}
                      >
                        <span
                          className={
                            styles.login__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={styles.login__form__submit__btn__load__arc}
                        >
                          <div
                            className={
                              styles.login__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    )}
                  </div>
                </form>
              )}
              <>
                <div className={styles.login__forgot}>
                  <button
                    className={styles.login__forgot__btn}
                    onClick={() => {
                      clearState();
                      dispatch({
                        type: "auth/clearFlash",
                      });
                      dispatch({ type: "ModalLogin/close" });
                      dispatch({ type: "ModalForgot/open" });
                    }}
                  >
                    Mot de passe oublié
                  </button>
                </div>
                <div className={styles.login__register}>
                  <button
                    className={styles.login__register__btn}
                    onClick={() => {
                      clearState();
                      dispatch({
                        type: "auth/clearFlash",
                      });
                      dispatch({ type: "ModalRegister/open" });
                      dispatch({ type: "ModalLogin/close" });
                    }}
                  >
                    Créer un compte
                  </button>
                </div>
              </>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormLogin;
