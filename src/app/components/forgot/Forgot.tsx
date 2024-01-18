import React, { useEffect, useState } from "react";
import styles from "./Forgot.module.scss";
import { AppDispatch, RootState } from "../../../../src/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import validator from "validator";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import useSWRMutation from "swr/mutation";
import fetchPost from "../fetch/FetchPost";

const Forgot = () => {
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [validInputEmail, setValidInputEmail] = useState<boolean>(false);
  const [inputEmailError, setInputEmailError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [displayReSendEmail, setDisplayReSendEmail] = useState<boolean>(false);
  const [emailUser, setEmailUser] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { displayModalForgot } = useSelector(
    (state: RootState) => state.ModalForgot
  );

  const { data, trigger } = useSWRMutation("/components/forgot/api", fetchPost);

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({ type: "ModalForgot/close" });
        clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
      } else if (data.status === 400) {
        setTimeout(() => {
          setIsLoading(false);
          data.message.forEach((element: string) => {
            if (element[0] === "email") {
              setInputEmailError(element[1]);
            }
          });
        }, 2000);
      } else {
        setTimeout(() => {
          if (data.type === "reset") {
            setDisplayReSendEmail(true);
            setEmailUser(data.email);
          }
          setIsLoading(false);
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
        }, 2000);
      }
    }
  }, [data, dispatch]);
  const clearState = () => {
    setInputPseudo("");
    setInputEmail("");
    setValidInputEmail(false);
    setInputEmailError("");
    setDisplayReSendEmail(false);
    setEmailUser("");
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
          /* let response = await fetch("/components/forgot/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: validator.escape(inputEmail.trim()),
              pseudo: validator.escape(inputPseudo.trim()),
            }),
          });
          let json = await response.json();
          if (json.status === 200) {
            dispatch({ type: "ModalForgot/close" });
            clearState();
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { flashMessage: json.message, type: "success" },
            });
          } else if (json.status === 400) {
            setTimeout(() => {
              setIsLoading(false);
              json.message.forEach((element: string) => {
                if (element[0] === "email") {
                  setInputEmailError(element[1]);
                }
              });
            }, 2000);
          } else {
            setTimeout(() => {
              if (json.type === "reset") {
                setDisplayReSendEmail(true);
                setEmailUser(json.email);
              }
              setIsLoading(false);
              dispatch({
                type: "flash/storeFlashMessage",
                payload: { type: "error", flashMessage: json.message },
              });
            }, 2000);
          } */
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
      <AnimatePresence>
        {displayModalForgot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
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
                    alt="arrow-left"
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </div>
              <h1 className={styles.forgot__h1}>
                Réinitialisation du mot de passe
              </h1>

              <form
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
                className={styles.forgot__form}
              >
                {" "}
                {/* <TextField
                  autoFocus
                  value={inputEmail}
                  style={{ margin: "10px 0px" }}
                  id={"email"}
                  label={"Email"}
                  variant="standard"
                  type={"email"}
                  sx={{
                    "& label": {
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    },
                  }}
                  placeholder={"Entrez votre email"}
                  FormHelperTextProps={{ style: { color: "red" } }}
                  onChange={(e) => {
                    handlerInput(
                      e,
                      /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                      setValidInputEmail,
                      setInputEmailError,
                      setInputEmail,
                      "Email : doit être un email valide"
                    );
                  }}
                  helperText={inputEmailError}
                /> */}
                <FormControl variant="standard">
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-email"
                  >
                    Email
                  </InputLabel>
                  <Input
                    autoFocus
                    id="standard-adornment-email"
                    value={inputEmail}
                    placeholder={"Entrez votre mail"}
                    type={"text"}
                    onChange={(e) => {
                      handlerInput(
                        e,
                        /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                        setValidInputEmail,
                        setInputEmailError,
                        setInputEmail,
                        "Email : doit être un email valide"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <AlternateEmailIcon
                          sx={{ color: "black" }}
                          aria-label="toggle email visibility"
                        >
                          <Visibility />
                        </AlternateEmailIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {inputEmailError}
                  </FormHelperText>
                </FormControl>
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
              {displayReSendEmail && (
                <div className={styles.forgot__form__submit}>
                  <button
                    className={styles.forgot__form__submit__btn}
                    onClick={() => {
                      const fetchApi = async () => {
                        let response = await fetch("/api/user/login", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            email: validator.escape(emailUser.trim()),
                          }),
                        });
                        let json = await response.json();
                        if (json.status === 200) {
                          dispatch({ type: "ModalForgot/close" });
                          dispatch({
                            type: "flash/storeFlashMessage",
                            payload: {
                              flashMessage: json.message,
                              type: "success",
                            },
                          });
                        } else {
                          if (json.type === "reset") {
                            setDisplayReSendEmail(true);
                            setEmailUser(json.email);
                          }
                          dispatch({
                            type: "flash/storeFlashMessage",
                            payload: {
                              flashMessage: json.message,
                              type: "error",
                            },
                          });
                        }
                      };
                      fetchApi();
                    }}
                  >
                    Renvoyer un code à l&apos;addresse {emailUser}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Forgot;
