import { AppDispatch } from "../../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./ModalUserPasswordData.module.scss";
import fetchUserEditPasswordData from "@/app/components/fetch/user/fetchUserEditPasswordData";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";

const ModalUserPasswordData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>("");
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");
  const [errorMessagePasswordComfirm, setErrorMessagePasswordComfirm] =
    useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/editPasswordUser",
    fetchUserEditPasswordData
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalEditPasswordData",
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
      type: "form/closeModalEditPasswordData",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validPasswordInput === true || validPasswordComfirmInput === true) {
      if (passwordInput === passwordComfirmInput) {
        const fetchLogin = async () => {
          trigger({ password: passwordInput });
        };
        fetchLogin();
      } else {
        setValidPasswordInput(false);
        setValidPasswordComfirmInput(false);
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe sont identiques"
        );
      }
    } else {
      if (validPasswordInput === false) {
        setErrorMessagePassword("Mot de passe : ne doit pas être vide");
      }
      if (validPasswordComfirmInput === false) {
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : ne doit pas être vide"
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
      if (
        passwordComfirmInput.length > 0 &&
        e.target.value !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
        setValidInput(true);
        setErrorMessage("");
      }
    } else if (e.target.value.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        e.target.value !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
        setValidInput(false);
        setErrorMessage("");
      }
    } else {
      if (
        passwordComfirmInput.length > 0 &&
        e.target.value !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
        setValidInput(false);
        setErrorMessage(errorMessage);
      }
    }
  };
  return (
    <>
      <div className={styles.modalEditPasswordData}>
        <button
          className={styles.modalEditPasswordData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditPasswordData__btn__cross}>
            &times;
          </span>
        </button>
        <h1 className={styles.modalEditPasswordData__h1}>
          Modification de votre mot de passe
        </h1>
        <form
          className={styles.modalEditPasswordData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <TextField
            value={passwordInput}
            style={{ margin: "20px 0px 0px 0px" }}
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
          <TextField
            value={passwordComfirmInput}
            style={{ margin: "20px 0px" }}
            id={"comfirmPassword"}
            label={"Comfirmation mot de passe"}
            variant="standard"
            type={"password"}
            placeholder={"Entrez votre comfirmation mot de passe"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              setPasswordComfirmInput(e.target.value);
              if (
                passwordInput.length > 0 &&
                e.target.value !== passwordInput
              ) {
                setValidPasswordComfirmInput(false);
                setErrorMessagePasswordComfirm(
                  "Comfirmation mot de passe : les mots de passe doivent être identique"
                );
              } else {
                setValidPasswordComfirmInput(true);

                setErrorMessagePasswordComfirm("");
              }
              /* handlerInput(
                e,
                "comfirmPassword",
                /^(?=.*[a-z]).{1,}$/,
                setValidPasswordComfirmInput,
                setErrorMessagePasswordComfirm,
                setPasswordComfirmInput,
                "Comfirmation mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
              ); */
            }}
            helperText={errorMessagePasswordComfirm}
          />
          <div className={styles.modalEditPasswordData__form__submit}>
            <input
              className={styles.modalEditPasswordData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserPasswordData;
