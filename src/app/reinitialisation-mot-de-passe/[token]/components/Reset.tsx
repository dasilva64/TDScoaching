"use client";

import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import styles from "../page.module.scss";
import { useDispatch } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import fetchPost from "@/app/components/fetch/FetchPost";
import { AppDispatch } from "@/app/redux/store";
import { FormHelperText } from "@mui/material";

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

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/reinitialisation-mot-de-passe/[token]/components/api",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        reset();
        push("/");
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "password") {
            setPasswordInputError(element[1]);
          }
        });
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
        reset();
        push("/");
      }
    }
  }, [data, dispatch, push, reset]);
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validPasswordInput === true && validPasswordComfirmInput === true) {
      if (passwordInput === passwordComfirmInput) {
        if (inputPseudo.length === 0) {
          const fetchReset = async () => {
            trigger({
              password: validator.escape(passwordInput.trim()),
              passwordConfirm: validator.escape(passwordComfirmInput.trim()),
              token: validator.escape(token[2].trim()),
              pseudo: validator.escape(inputPseudo.trim()),
            });
          };
          fetchReset();
        }
      } else {
        setValidPasswordInput(false);
        setValidPasswordComfirmInput(false);
        setPasswordComfirmError(
          "Comfirmation mot de passe : les mots de passe sont identiques"
        );
      }
    } else {
      if (validPasswordInput === false) {
        if (passwordInput.length === 0) {
          setPasswordInputError("Mot de passe : ne peut pas être vide");
        }
      }
      if (validPasswordComfirmInput === false) {
        if (passwordComfirmInput.length === 0) {
          setPasswordComfirmError(
            "Comfirmation mot de passe : les mots de passe doivent être identique"
          );
        }
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordComfirm, setShowPasswordComfirm] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPasswordComfirm = () =>
    setShowPasswordComfirm((show) => !show);

  return (
    <form
      className={styles.reset__form}
      id="form"
      onSubmit={(e) => {
        handlerSubmit(e);
      }}
    >
      <FormControl
        variant="standard"
        style={{ margin: "10px 0px" }}
        className={styles.reset__form__input__password__control}
      >
        <InputLabel
          sx={{
            color: "black",
            "&.Mui-focused": {
              color: "#1976d2",
            },
          }}
          htmlFor="standard-adornment-password"
        >
          Mot de passe
        </InputLabel>
        <Input
          id="standard-adornment-password"
          value={passwordInput}
          placeholder={"Entrez votre mot de passe"}
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            handlerInput(
              e,
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#=&,_])[A-Za-z\d-?!*:@~%.;+|$#=&,_]{8,}$/,
              setValidPasswordInput,
              setPasswordInputError,
              setPasswordInput,
              "Mot de passe : doit avoir une lettre en minuscule, majuscule, un nombre, un caractère spécial (-?!*:@~%.;+|$#=&,_) et 8 caractères minimum"
            );
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText
          style={{ color: "red" }}
          className={styles.reset__form__input__password__helperText}
        >
          {passwordInputError}
        </FormHelperText>
      </FormControl>
      <FormControl variant="standard" style={{ margin: "10px 0px" }}>
        <InputLabel
          sx={{
            color: "black",
            "&.Mui-focused": {
              color: "#1976d2",
            },
          }}
          htmlFor="standard-adornment-password-comfirm"
        >
          Comfirmation de mot de passe
        </InputLabel>
        <Input
          id="standard-adornment-password-comfirm"
          value={passwordComfirmInput}
          placeholder={"Entrez votre comfirmation de mot de passe"}
          type={showPasswordComfirm ? "text" : "password"}
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
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPasswordComfirm}
              >
                {showPasswordComfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText style={{ color: "red" }}>
          {passwordComfirmInputError}
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
      <div className={styles.reset__form__submit}>
        {isMutating && (
          <button disabled className={styles.reset__form__submit__btn__load}>
            <span className={styles.reset__form__submit__btn__load__span}>
              Chargement
            </span>

            <div className={styles.reset__form__submit__btn__load__arc}>
              <div
                className={styles.reset__form__submit__btn__load__arc__circle}
              ></div>
            </div>
          </button>
        )}
        {!isMutating && (
          <input
            className={styles.reset__form__submit__btn}
            type="submit"
            value="Réinitialiser"
          />
        )}
      </div>
    </form>
  );
};

export default Reset;
