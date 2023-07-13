"use client";

import React, { useEffect, useState } from "react";
import styles from "./formLogin.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import GroupForm from "../form/group";
import useSWRMutation from "swr/mutation";
import fetchUserLogin from "../hook/useLogin";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { error } from "console";

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

  const { trigger, data } = useSWRMutation("/api/login", fetchUserLogin);
  const handlerInputRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    setRememberMeInput(e.target.checked);
  };
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        console.log(data);
        /* let ar;
        if (data.body.editEmail) {
          ar = [data.body.editEmail.newEmail, data.body.editEmail.limitDate];
        } else {
          ar = null;
        } */
        dispatch({
          type: "form/toggleLogin",
        });
        dispatch({
          type: "auth/login",
          payload: {
            //email: data.body.email,
            role: data.body.role,
            id: data.body.id,
            /* firstname: data.body.firstname,
            lastname: data.body.lastname,
            phone: data.body.phone,
            editEmail: ar, */
          },
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
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
        trigger({
          email: emailInput,
          password: passwordInput,
          remember: rememberMeInput,
        });
        /* let response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: emailInput,
            password: passwordInput,
            remember: rememberMeInput,
          }),
        });
        let json = await response.json();
        console.log(json); */
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
