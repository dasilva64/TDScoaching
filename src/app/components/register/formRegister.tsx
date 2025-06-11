import React, { useEffect, useState } from "react";
import styles from "./formRegister.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../src/app/redux/store";
import Link from "next/link";
import Image from "../image/Image";
import { AnimatePresence, motion } from "framer-motion";
import useSWRMutation from "swr/mutation";
import fetchPost from "../fetch/FetchPost";
import Input from "../input/Input";
import TabIndex from "../tabIndex/TabIndex";

const FormRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [firstnameInput, setFirstnameInput] = useState<string>("");
  const [lastnameInput, setLastnameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>("");
  const [majorInput, setMajorInput] = useState<string>("");
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [validFirstnameInput, setValidFirstnameInput] =
    useState<boolean>(false);
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(false);
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [validMajorInput, setValidMajorInput] = useState<boolean>(false);
  const [firstnameInputError, setFirstnameInputError] = useState<string>("");
  const [lastnameInputError, setLastnameInputError] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<string>("");
  const [passwordComfirmInputError, setPasswordComfirmError] =
    useState<string>("");
  const [emailInputError, setEmailInputError] = useState<string>("");
  const [majorInputError, setMajorInputError] = useState<string>("");
  const { displayModalRegister } = useSelector(
    (state: RootState) => state.ModalRegister
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, trigger, reset } = useSWRMutation(
    "/components/register/api",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        clearState();
        dispatch({
          type: "csrfToken/store",
          payload: { csrfToken: data.csrfToken },
        });
        dispatch({ type: "ModalRegister/close" });
        reset();
      } else if (data.status === 400 && data.type === "validation") {
        setTimeout(() => {
          setIsLoading(false);
          setPasswordInput("");
          setPasswordComfirmInput("");
          setValidPasswordInput(false);
          setValidPasswordComfirmInput(false);
          setValidEmailInput(false);
          setEmailInput("");
          data.message.forEach((element: string) => {
            if (element[0] === "email") {
              setEmailInputError(element[1]);
            }
            if (element[0] === "password") {
              setPasswordInputError(element[1]);
            }
            if (element[0] === "firstname") {
              setFirstnameInputError(element[1]);
            }
            if (element[0] === "lastname") {
              setLastnameInputError(element[1]);
            }
          });
          reset();
        }, 2000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setPasswordInput("");
          setPasswordComfirmInput("");
          setValidPasswordInput(false);
          setValidPasswordComfirmInput(false);
          setValidEmailInput(false);
          setEmailInput("");
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { flashMessage: data.message, type: "error" },
          });
          reset();
        }, 2000);
      }
    }
  }, [data, dispatch, reset]);
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (
      validEmailInput === true &&
      validFirstnameInput === true &&
      validLastnameInput === true &&
      validPasswordInput === true &&
      validPasswordComfirmInput === true &&
      validMajorInput === true
    ) {
      if (passwordInput === passwordComfirmInput) {
        if (inputPseudo.length === 0) {
          setIsLoading(true);
          const fetchRegister = async () => {
            trigger({
              email: emailInput.trim(),
              password: passwordInput.trim(),
              passwordComfirm: passwordComfirmInput.trim(),
              firstname: firstnameInput.trim(),
              lastname: lastnameInput.trim(),
              pseudo: inputPseudo.trim(),
            });
          };
          fetchRegister();
        }
      } else {
        setValidPasswordInput(false);
        setValidPasswordComfirmInput(false);
        setPasswordComfirmError(
          "Confirmation mot de passe : les mots de passe sont identiques"
        );
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      if (validEmailInput === false) {
        if (emailInput.length === 0) {
          setEmailInputError("Email : ne peut être vide");
        }
      }
      if (validFirstnameInput === false) {
        if (firstnameInput.length === 0) {
          setFirstnameInputError("Prénom : ne peut être vide");
        }
      }
      if (validLastnameInput === false) {
        if (lastnameInput.length === 0) {
          setLastnameInputError("Nom de famille : ne peut être vide");
        }
      }
      if (validPasswordInput === false) {
        if (passwordInput.length === 0) {
          setPasswordInputError("Mot de passe : ne peut être vide");
        }
      }
      if (validPasswordComfirmInput === false) {
        if (passwordComfirmInput.length === 0) {
          setPasswordComfirmError(
            "Confirmation mot de passe : les mots de passe doivent être identiques"
          );
        }
      }
      if (validMajorInput === false) {
        setMajorInputError("Vous devez être majeur pour vous inscrire");
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
    let removeSpace = "";
    if (e.target.value.charAt(0) === " ") {
      removeSpace = e.target.value.replace(/\s/, "");
      setInput(removeSpace);
    } else {
      removeSpace = e.target.value.replace(/\s\s+/g, " ");
      setInput(removeSpace);
    }

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
  const handlerInputPassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      removeSpace = e.target.value.replace(/\s+/g, "");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else if (
        passwordComfirmInput.length > 0 &&
        removeSpace === passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      } else {
        setValidInput(true);
        setErrorMessage("");
      }
    } else if (removeSpace.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setPasswordComfirmError(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage("");
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    } else {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setPasswordComfirmError(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    }
  };
  const inputRef: any = React.useRef();
  useEffect(() => {
    if (displayModalRegister === true) {
      if (inputRef && inputRef.current) {
        inputRef.current.addEventListener("keydown", (e: any) => {
          if (e.key === "Enter") {
            e.srcElement.click();
            e.preventDefault();
          }
        });
      }
    }
  }, [displayModalRegister]);
  const clearState = () => {
    setValidEmailInput(false);
    setValidFirstnameInput(false);
    setValidLastnameInput(false);
    setValidPasswordInput(false);
    setValidPasswordComfirmInput(false);
    setValidMajorInput(false);
    setEmailInput("");
    setFirstnameInput("");
    setLastnameInput("");
    setPasswordInput("");
    setPasswordComfirmInput("");
    setMajorInput("");
    setEmailInputError("");
    setFirstnameInputError("");
    setLastnameInputError("");
    setIsLoading(false);
    setPasswordInputError("");
    setPasswordComfirmError("");
    setMajorInputError("");
    setInputPseudo("");
  };
  const backLogin = async () => {
    clearState();
    await dispatch({ type: "ModalRegister/close" });
    await dispatch({ type: "ModalLogin/open" });
  };
  const closeForm = () => {
    clearState();
    dispatch({ type: "ModalRegister/close" });
  };
  return (
    <>
      <TabIndex displayModal={displayModalRegister} />
      <AnimatePresence>
        {displayModalRegister && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
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
              className={styles.register}
            >
              <div className={styles.register__top}>
                <button
                  className={styles.register__top__back}
                  type="button"
                  onClick={() => {
                    backLogin();
                  }}
                >
                  Retour à la connection
                </button>
                <button
                  type="button"
                  className={styles.register__top__close}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => closeForm()}
                >
                  <Image
                    className={styles.register__top__close__img}
                    src="/assets/icone/xmark-solid.svg"
                    alt="icone fermer modal"
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </div>

              <h2 className={`${styles.register__h1}`}>Création de compte</h2>
              <form
                className={styles.register__form}
                action=""
                onSubmit={(e) => {
                  if (isLoading === false) {
                    handlerSubmit(e);
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                <Input
                  type={"text"}
                  value={firstnameInput}
                  id={"firstname"}
                  placeholder={"Entrez votre prénom"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInput(
                      e,
                      /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/,
                      setValidFirstnameInput,
                      setFirstnameInputError,
                      setFirstnameInput,
                      "Prénom : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
                    );
                  }}
                  validInput={validFirstnameInput}
                  errorMessage={firstnameInputError}
                  label={"Prénom"}
                  image={"user-solid"}
                  alt={"icone utilisateur"}
                  position={"first"}
                  tab={true}
                />
                <Input
                  type={"text"}
                  value={lastnameInput}
                  id={"lastname"}
                  placeholder={"Entrez votre nom de famille"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInput(
                      e,
                      /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/,
                      setValidLastnameInput,
                      setLastnameInputError,
                      setLastnameInput,
                      "Nom de famille : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
                    );
                  }}
                  validInput={validLastnameInput}
                  errorMessage={lastnameInputError}
                  label={"Nom de famille"}
                  image={"user-solid"}
                  alt={"icone utilisateur"}
                  tab={true}
                />
                <Input
                  type={"password"}
                  value={passwordInput}
                  id={"password"}
                  placeholder={"Entrez votre mot de passe"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInputPassword(
                      e,
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#,_])[A-Za-z\d-?!*:@~%.;+|$#,_]{12,}$/,
                      setValidPasswordInput,
                      setPasswordInputError,
                      setPasswordInput,
                      "Mot de passe : doit avoir une lettre en minuscule, majuscule, un nombre, un caractère spécial (-?!*:@~%.;+|$#,_) et 12 caractères minimum"
                    );
                  }}
                  validInput={validPasswordInput}
                  errorMessage={passwordInputError}
                  label={"Mot de passe"}
                  image={"eye-solid"}
                  alt={"icone afficher mot de passe"}
                  tab={true}
                />
                <Input
                  type={"password"}
                  value={passwordComfirmInput}
                  id={"passwordComfirm"}
                  placeholder={"Entrez confirmation de votre mot de passe"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let removeSpace = "";
                    if (e.target.value.charAt(0) === " ") {
                      removeSpace = e.target.value.replace(/\s/, "");
                      setPasswordComfirmInput(removeSpace);
                    } else {
                      removeSpace = e.target.value.replace(/\s+/g, "");
                      setPasswordComfirmInput(removeSpace);
                    }
                    if (
                      passwordInput.length > 0 &&
                      removeSpace !== passwordInput
                    ) {
                      setValidPasswordComfirmInput(false);
                      setPasswordComfirmError(
                        "Confirmation mot de passe : les mots de passe doivent être identique"
                      );
                    } else {
                      setValidPasswordComfirmInput(true);
                      setPasswordComfirmError("");
                    }
                  }}
                  validInput={validPasswordComfirmInput}
                  errorMessage={passwordComfirmInputError}
                  label={"Confirmation mot de passe"}
                  image={"eye-solid"}
                  alt={"icone afficher mot de passe"}
                  tab={true}
                />
                <Input
                  type={"text"}
                  value={emailInput}
                  id={"email"}
                  placeholder={"Entrez votre mail"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInput(
                      e,
                      /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                      setValidEmailInput,
                      setEmailInputError,
                      setEmailInput,
                      "Email : doit être un email valide"
                    );
                  }}
                  validInput={validEmailInput}
                  errorMessage={emailInputError}
                  label={"Email"}
                  image={"at-solid"}
                  alt={"icone email"}
                  tab={true}
                />
                <div className={styles.register__form__div}>
                  <div className={styles.register__form__div__div}>
                    <label
                      className={styles.register__form__div__div__label}
                      htmlFor="remenber"
                    >
                      Êtes vous majeur ?
                    </label>
                    <input
                      ref={inputRef}
                      className={styles.register__form__div__div__checkbox}
                      type="checkbox"
                      name="legal"
                      id="legal"
                      onChange={(e) => {
                        if (e.target.checked === true) {
                          setMajorInput("true");
                          setValidMajorInput(true);
                          setMajorInputError("");
                        } else {
                          setMajorInput("false");
                          setValidMajorInput(false);
                          setMajorInputError(
                            "Vous devez être majeur pour vous inscrire"
                          );
                        }
                      }}
                    />
                  </div>
                  <div className={styles.register__form__div__div__error}>
                    {majorInputError}
                  </div>
                </div>
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.register__form__hidden}
                  /* style={{ display: "none" }} */
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <p>
                  En vous inscrivant, vous acceptez nos{" "}
                  <Link
                    className={styles.register__form__link}
                    target="_blank"
                    href={"/conditions-generales-utilisations"}
                  >
                    conditions générales d&apos;utilisation
                  </Link>{" "}
                  du site
                </p>
                <div className={styles.register__form__submit}>
                  {isLoading === false && (
                    <input
                      className={styles.register__form__submit__btn}
                      type="submit"
                      value="S'inscrire"
                    />
                  )}
                  {isLoading === true && (
                    <button
                      disabled
                      className={styles.register__form__submit__btn__load}
                    >
                      <span
                        className={
                          styles.register__form__submit__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.register__form__submit__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.register__form__submit__btn__load__arc__circle
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

export default FormRegister;

// /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
