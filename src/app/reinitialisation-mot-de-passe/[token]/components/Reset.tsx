"use client";

import React, { useEffect, useState } from "react";
import styles from "../page.module.scss";
import { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";
import validator from "validator";
import fetchPost from "@/app/components/fetch/FetchPost";

const Reset = () => {
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  const dispatch = useDispatch<AppDispatch>();

  const [inputPseudo, setInputPseudo] = useState<string>("");
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
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        push("/");
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "password") {
            setPasswordInputError(element[1]);
          }
        });
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
      if (inputPseudo.length === 0) {
        const fetchReset = async () => {
          trigger({
            password: validator.escape(passwordInput.trim()),
            token: validator.escape(token[2].trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchReset();
      }
    } else {
      if (validPasswordInput === false) {
        setPasswordInputError("Mot de passe : ne doit pas être vide");
      }
      if (validPasswordComfirmInput === false) {
        setPasswordComfirmError(
          "Comfirmation mot de passe : ne doit pas être vide"
        );
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
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    } else if (removeSpace.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
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
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage(errorMessage);
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
        autoFocus
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
            /^(?=.*[a-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi]).{1,}$/,
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
          let removeSpace = "";
          if (e.target.value.charAt(0) === " ") {
            removeSpace = e.target.value.replace(/\s/, "");
            setPasswordComfirmInput(removeSpace);
          } else {
            removeSpace = e.target.value.replace(/\s+/g, "");
            setPasswordComfirmInput(removeSpace);
          }
          if (passwordInput.length > 0 && removeSpace !== passwordInput) {
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
