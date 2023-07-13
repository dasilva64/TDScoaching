import React, { useEffect, useRef, useState } from "react";
import styles from "./formRegister.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import GroupForm from "../form/group";
import useRegister from "../hook/useRegister";
import useSWRMutation from "swr/mutation";
import fetchUserRegister from "../hook/useRegister";
import { TextField } from "@mui/material";
import { error } from "console";

const FormRegister = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const [emailInput, setEmailInput] = useState<string>("");
  const [firstnameInput, setFirstnameInput] = useState<string>("");
  const [lastnameInput, setLastnameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>("");
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [validFirstnameInput, setValidFirstnameInput] =
    useState<boolean>(false);
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(false);
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [validPhoneInput, setValidPhoneInput] = useState<boolean>(false);
  const [firstnameInputError, setFirstnameInputError] = useState<string>("");
  const [lastnameInputError, setLastnameInputError] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<string>("");
  const [passwordComfirmInputError, setPasswordComfirmError] =
    useState<string>("");
  const [emailInputError, setEmailInputError] = useState<string>("");
  const [phoneInputError, setPhoneInputError] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/register",
    fetchUserRegister
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        dispatch({ type: "form/closeRegisterOpenLogin" });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
      }
    }
  }, [data, dispatch]);
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      validEmailInput === true &&
      validFirstnameInput === true &&
      validLastnameInput === true &&
      validPasswordInput === true &&
      validPasswordComfirmInput === true &&
      validPhoneInput === true
    ) {
      const fetchRegister = async () => {
        trigger({
          email: emailInput,
          password: passwordInput,
          firstname: firstnameInput,
          lastname: lastnameInput,
          phone: phoneInput,
        });
      };
      fetchRegister();
    } else {
      if (validEmailInput === false) {
        setEmailInputError("Email : need to be not empty");
      }
      if (validFirstnameInput === false) {
        setFirstnameInputError("Prénom : 3 lettres minimum");
      }
      if (validLastnameInput === false) {
        setLastnameInputError("Nom de famille : 3 lettres minimum");
      }
      if (validPasswordInput === false) {
        setPasswordInputError(
          "Mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
        );
      }
      if (validPasswordComfirmInput === false) {
        setPasswordComfirmError(
          "Comfirmation mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
        );
      }
      if (validPhoneInput === false) {
        setPhoneInputError(
          "Téléphone : doit être une numéro de téléphone valide"
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
      <div className={styles.register}>
        <div className={styles.register__top}>
          <button
            className={styles.register__top__back}
            onClick={() => {
              dispatch({ type: "form/closeRegisterOpenLogin" });
            }}
          >
            Retour à la connection
          </button>
          <button
            className={styles.register__top__close}
            onClick={() => dispatch({ type: "form/toggleRegister" })}
          >
            <span className={styles.register__top__close__cross}>&times;</span>
          </button>
        </div>

        <h1 className={styles.register__h1}>Création de compte</h1>
        <form
          className={styles.register__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <TextField
            value={firstnameInput}
            style={{ margin: "10px 0px" }}
            id={"firstname"}
            label={"Prénom"}
            variant="standard"
            type={"text"}
            placeholder={"Entrez votre prénom"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                /^[A-Za-z]{3,}$/,
                setValidFirstnameInput,
                setFirstnameInputError,
                setFirstnameInput,
                "Prénom : 3 lettres minimum"
              );
            }}
            helperText={firstnameInputError}
          />
          <TextField
            value={lastnameInput}
            style={{ margin: "10px 0px" }}
            id={"lastname"}
            label={"Nom de famille"}
            variant="standard"
            type={"text"}
            placeholder={"Entrez votre nom de famille"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                /^[A-Za-z]{3,}$/,
                setValidLastnameInput,
                setLastnameInputError,
                setLastnameInput,
                "Nom de famille : 3 lettres minimum"
              );
            }}
            helperText={lastnameInputError}
          />
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
              handlerInput(
                e,
                /^(?=.*[a-z]).{1,}$/,
                setValidPasswordComfirmInput,
                setPasswordComfirmError,
                setPasswordComfirmInput,
                "Comfirmation mot de passe : doit correspondre"
              );
            }}
            helperText={passwordComfirmInputError}
          />
          <TextField
            value={emailInput}
            style={{ margin: "10px 0px" }}
            id={"email"}
            label={"Email"}
            variant="standard"
            type={"email"}
            placeholder={"Entrez votre email"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                setValidEmailInput,
                setEmailInputError,
                setEmailInput,
                "Email : doit être un email valide"
              );
            }}
            helperText={emailInputError}
          />
          <TextField
            value={phoneInput}
            style={{ margin: "10px 0px" }}
            id={"phone"}
            label={"Téléphone"}
            variant="standard"
            type={"tel"}
            placeholder={"Entrez votre numéro de téléphone"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                /^[0-9]{10,10}$/,
                setValidPhoneInput,
                setPhoneInputError,
                setPhoneInput,
                "Téléphone : doit être une numéro de téléphone valide"
              );
            }}
            helperText={phoneInputError}
          />
          <div className={styles.register__form__submit}>
            <input
              className={styles.register__form__submit__btn}
              type="submit"
              value="S'inscrire"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default FormRegister;
