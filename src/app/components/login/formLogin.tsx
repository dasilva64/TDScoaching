import React, { use, useEffect, useRef, useState } from "react";
import styles from "./formLogin.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { mutate } from "swr";
import validator from "validator";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import fetchUserReSendEmailValidation from "../fetch/user/fetchUserReSendEmailValidation";
import useSWRMutation from "swr/mutation";

const FormLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [rememberMeInput, setRememberMeInput] = useState<boolean>(false);
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState<string>("");
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");
  const [reSendEmail, setReSendEmail] = useState<boolean>(false);
  const [otherEmail, setOtherEmail] = useState<string>("");
  const el = useRef(null);

  const handlerInputRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMeInput(e.target.checked);
  };

  const { data, trigger } = useSWRMutation(
    "/api/user/reSendEmailValidation",
    fetchUserReSendEmailValidation
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        setReSendEmail(false);
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch]);

  const closeForm = () => {
    dispatch({
      type: "auth/clearFlash",
    });
    dispatch({
      type: "form/toggleLogin",
    });
  };
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validEmailInput === true && validPasswordInput === true) {
      const fetchLogin = async () => {
        let response = await fetch("/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: validator.escape(emailInput.trim()),
            password: validator.escape(passwordInput.trim()),
            remember: rememberMeInput,
            pseudo: validator.escape(inputPseudo.trim()),
          }),
        });
        let json = await response.json();
        if (json) {
          if (json.status === 200) {
            setValidEmailInput(false);
            setValidPasswordInput(false);
            mutate("/api/user/check");
            dispatch({
              type: "form/toggleLogin",
            });
            dispatch({
              type: "auth/login",
              payload: {
                role: json.body.role,
                id: json.body.id,
              },
            });
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "success", flashMessage: json.message },
            });
          } else if (json.status === 400) {
            json.message.forEach((element: string) => {
              if (element[0] === "email") {
                setErrorMessageEmail(element[1]);
              }
              if (element[0] === "password") {
                setErrorMessagePassword(element[1]);
              }
            });
            setValidEmailInput(false);
            setValidPasswordInput(false);
            setPasswordInput("");
          } else if (
            json.status === 404 &&
            json.message ===
              "Votre compte n'est pas encore validé, veuillez vérifier votre boite mail"
          ) {
            setReSendEmail(true);
            setOtherEmail(emailInput);
            setValidEmailInput(false);
            setValidPasswordInput(false);
            setPasswordInput("");
            setEmailInput("");
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: json.message },
            });
          } else {
            setPasswordInput("");
            setEmailInput("");
            setValidEmailInput(false);
            setValidPasswordInput(false);
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: json.message },
            });
          }
        }
      };
      if (inputPseudo.length === 0) {
        fetchLogin();
      }
    } else {
      if (validEmailInput === false) {
        setErrorMessageEmail("Email : doit avoir un format valide");
      }
      if (validPasswordInput === false) {
        setErrorMessagePassword(
          "Mot de passe : doit avoir une lettre en minuscule, un nombre et 8 caractères minimum"
        );
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
      <div className={styles.login}>
        <button className={styles.login__btn} onClick={() => closeForm()}>
          <span className={styles.login__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.login__h1}>Se connecter</h1>
        <form
          className={styles.login__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <TextField
            autoFocus
            value={emailInput}
            id={"email"}
            label={"Email"}
            variant="standard"
            type={"email"}
            placeholder={"Entrez votre mail"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                "email",
                /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                setValidEmailInput,
                setErrorMessageEmail,
                setEmailInput,
                "Email : doit avoir un format valide"
              );
            }}
            helperText={errorMessageEmail}
          />
          <TextField
            value={passwordInput}
            style={{ margin: "20px 0px" }}
            id={"password"}
            label={"Mot de passe"}
            variant="standard"
            type={"password"}
            placeholder={"Entrez votre mot de passe"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                "password",
                /^(?=.*[a-z]).{1,}$/,
                setValidPasswordInput,
                setErrorMessagePassword,
                setPasswordInput,
                "Mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
              );
            }}
            helperText={errorMessagePassword}
          />
          <FormControlLabel
            className={styles.login__form__checkbox}
            style={{ marginTop: "10px", alignSelf: "start", marginLeft: "0px" }}
            control={
              <Checkbox
                onChange={(e) => {
                  handlerInputRememberMe(e);
                }}
              />
            }
            label="Se souvenir de moi"
            labelPlacement="start"
          />
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
            <input
              className={styles.login__form__submit__btn}
              type="submit"
              value="Se connecter"
            />
          </div>
        </form>
        {reSendEmail === true && (
          <div className={styles.login__forgot}>
            <button
              className={styles.login__forgot__btn}
              onClick={() => {
                trigger({ email: otherEmail });
              }}
            >
              Renvoyer un mail de validation à {otherEmail}
            </button>
          </div>
        )}

        <div className={styles.login__forgot}>
          <button
            className={styles.login__forgot__btn}
            onClick={() => {
              dispatch({
                type: "auth/clearFlash",
              });
              dispatch({ type: "form/openForgot" });
            }}
          >
            Mot de passe oublié
          </button>
        </div>
        <div className={styles.login__register}>
          <button
            className={styles.login__register__btn}
            onClick={() => {
              dispatch({
                type: "auth/clearFlash",
              });
              dispatch({ type: "form/toggleRegister" });
            }}
          >
            Créer un compte
          </button>
        </div>
      </div>
    </>
  );
};

export default FormLogin;

// /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
