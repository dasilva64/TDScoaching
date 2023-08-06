import React, { useEffect, useState } from "react";
import styles from "./formLogin.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { mutate } from "swr";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";

const FormLogin = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [rememberMeInput, setRememberMeInput] = useState<boolean>(false);
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState<string>("");
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");

  const handlerInputRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMeInput(e.target.checked);
  };

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
            mail: emailInput,
            password: passwordInput,
            remember: rememberMeInput,
          }),
        });
        let json = await response.json();
        if (json) {
          if (json.status === 200) {
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
          } else {
            setPasswordInput("");
            setEmailInput("");
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: json.message },
            });
          }
        }
      };
      if (isLog === false) {
        fetchLogin();
      }
    } else {
      if (validEmailInput === false) {
        setErrorMessageEmail("Email : ne doit pas être vide");
      }
      if (validPasswordInput === false) {
        setErrorMessagePassword("Password : ne doit pas être vide");
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
          <div className={styles.login__form__submit}>
            <input
              className={styles.login__form__submit__btn}
              type="submit"
              value="Se connecter"
            />
          </div>
        </form>
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
