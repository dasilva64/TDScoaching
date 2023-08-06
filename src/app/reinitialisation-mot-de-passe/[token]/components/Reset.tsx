"use client";

import React, { useEffect, useState } from "react";
import styles from "../page.module.scss";
import { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWRMutation from "swr/mutation";
import fetchUserResetPassword from "../../../components/fetch/user/fetchUserResetPassword";
import { TextField } from "@mui/material";

const Reset = () => {
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  console.log(token);
  const dispatch = useDispatch<AppDispatch>();

  const { push } = useRouter();
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>("");
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [passwordInputError, setPasswordInputError] = useState<string>("");
  const [passwordComfirmInputError, setPasswordComfirmError] =
    useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/resetPassword",
    fetchUserResetPassword
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        push("/");
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
        push("/");
      }
    }
  }, [data, dispatch, push]);
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validPasswordInput === true && validPasswordComfirmInput === true) {
      const fetchReset = async () => {
        console.log(token[2]);
        trigger({ password: passwordInput, token: token[2] });
      };
      fetchReset();
    } else {
      if (validPasswordInput === false) {
        setPasswordInputError("Password : need to be not empty");
      }
      if (validPasswordComfirmInput === false) {
        setPasswordComfirmError("Password Comfirm : need to be not empty");
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
      if (
        passwordComfirmInput.length > 0 &&
        e.target.value !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    } else if (e.target.value.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        e.target.value !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setPasswordComfirmError(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
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
        e.target.value !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setPasswordComfirmError(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
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
  return (
    <form
      className={styles.reset__form}
      id="form"
      onSubmit={(e) => {
        handlerSubmit(e);
      }}
    >
      <TextField
        value={passwordInput}
        style={{ margin: "10px 0px" }}
        id={"password"}
        label={"Mot de passe"}
        variant="standard"
        type={"password"}
        placeholder={"Entrez votre mot de passe"}
        FormHelperTextProps={{ style: { color: "red" } }}
        onChange={(e) => {
          handlerInput(
            e,
            /^(?=.*[a-z]).{1,}$/,
            setValidPasswordInput,
            setPasswordInputError,
            setPasswordInput,
            "Mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
          );
        }}
        helperText={passwordInputError}
      />
      <TextField
        value={passwordComfirmInput}
        style={{ margin: "10px 0px" }}
        id={"passwordComfirm"}
        label={"Comfirmation mot de passe"}
        variant="standard"
        type={"password"}
        placeholder={"Entrez comfirmation de votre mot de passe"}
        FormHelperTextProps={{ style: { color: "red" } }}
        onChange={(e) => {
          setPasswordComfirmInput(e.target.value);
          if (passwordInput.length > 0 && e.target.value !== passwordInput) {
            setValidPasswordComfirmInput(false);
            setPasswordComfirmError(
              "Comfirmation mot de passe : les mots de passe doivent être identique"
            );
          } else {
            setValidPasswordComfirmInput(true);

            setPasswordComfirmError("");
          }
        }}
        helperText={passwordComfirmInputError}
      />
      <div className={styles.reset__form__submit}>
        <input
          className={styles.reset__form__submit__btn}
          type="submit"
          value="Réinitialiser"
        />
        <div className={styles.reset__form__input__error}></div>
      </div>
    </form>
  );
};

export default Reset;
