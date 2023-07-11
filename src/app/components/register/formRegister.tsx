import React, { useEffect, useRef, useState } from "react";
import styles from "./formRegister.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import GroupForm from "../form/group";
import useRegister from "../hook/useRegister";
import useSWRMutation from "swr/mutation";
import fetchUserRegister from "../hook/useRegister";

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
          <GroupForm
            nameLabel={"Prénom"}
            typeInput={"text"}
            nameInput={"firstname"}
            errorMessageInput={"Prénom : 3 lettres minimum"}
            regex={/^[A-Za-z]{3,}$/}
            setInputValue={setFirstnameInput}
            setValidInput={setValidFirstnameInput}
            errorMessage={firstnameInputError}
            setErrorMessage={setFirstnameInputError}
          />
          <GroupForm
            nameLabel={"Nom de famille"}
            typeInput={"text"}
            nameInput={"lastname"}
            errorMessageInput={"Nom de famille : 3 lettres minimum"}
            regex={/^[A-Za-z]{3,}$/}
            setInputValue={setLastnameInput}
            setValidInput={setValidLastnameInput}
            errorMessage={lastnameInputError}
            setErrorMessage={setLastnameInputError}
          />
          <GroupForm
            nameLabel={"Mot de passe"}
            typeInput={"password"}
            nameInput={"password"}
            errorMessageInput={
              "Mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
            }
            regex={/^(?=.*[a-z]).{1,}$/}
            setInputValue={setPasswordInput}
            setValidInput={setValidPasswordInput}
            errorMessage={passwordInputError}
            setErrorMessage={setPasswordInputError}
          />
          <GroupForm
            nameLabel={"Comfirmation mot de passe"}
            typeInput={"password"}
            nameInput={"comfirmPassword"}
            errorMessageInput={"Comfirmation mot de passe : doit correspondre"}
            regex={/^(?=.*[a-z]).{1,}$/}
            setInputValue={setPasswordComfirmInput}
            setValidInput={setValidPasswordComfirmInput}
            errorMessage={passwordComfirmInputError}
            setErrorMessage={setPasswordComfirmError}
          />
          <GroupForm
            nameLabel={"Email"}
            typeInput={"text"}
            nameInput={"email"}
            errorMessageInput={"Email : doit être un email valide"}
            regex={/^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/}
            setInputValue={setEmailInput}
            setValidInput={setValidEmailInput}
            errorMessage={emailInputError}
            setErrorMessage={setEmailInputError}
          />
          <GroupForm
            nameLabel={"Télephone"}
            typeInput={"tel"}
            nameInput={"phone"}
            errorMessageInput={
              "Téléphone : doit être une numéro de téléphone valide"
            }
            regex={/^[0-9]{10,10}$/}
            setInputValue={setPhoneInput}
            setValidInput={setValidPhoneInput}
            errorMessage={phoneInputError}
            setErrorMessage={setPhoneInputError}
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
