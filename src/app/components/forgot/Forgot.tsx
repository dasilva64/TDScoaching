import React, { useEffect, useState } from "react";
import styles from "./Forgot.module.scss";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import GroupForm from "../form/group";
import fetchUserForgotEmail from "../fetch/user/fetchUserForgot";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";
import fetchUserReSendForgotPassword from "../fetch/user/fetchUserReSendForgotPassword";

const Forgot = () => {
  const [inputEmail, setInputEmail] = useState<string>("");
  const [validInputEmail, setValidInputEmail] = useState<boolean>(false);
  const [inputEmailError, setInputEmailError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [displayReSendEmail, setDisplayReSendEmail] = useState<boolean>(false);
  const [emailUser, setEmailUser] = useState<string>("");
  const { trigger, data } = useSWRMutation(
    "/api/user/forgotPassword",
    fetchUserForgotEmail
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({ type: "form/closeForgotOpenLogin" });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
      } else {
        if (data.type === "reset") {
          setDisplayReSendEmail(true);
          setEmailUser(data.email);
        }
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
      }
    }
  }, [data, dispatch]);

  const { trigger: triggerReSend, data: dateReSend } = useSWRMutation(
    "/api/user/reSendForgotPassword",
    fetchUserReSendForgotPassword
  );

  useEffect(() => {
    if (dateReSend) {
      if (dateReSend.status === 200) {
        dispatch({ type: "form/closeForgotOpenLogin" });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: dateReSend.message, type: "success" },
        });
      } else {
        if (dateReSend.type === "reset") {
          setDisplayReSendEmail(true);
          setEmailUser(dateReSend.email);
        }
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: dateReSend.message, type: "error" },
        });
      }
    }
  }, [dateReSend, dispatch]);
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validInputEmail === true) {
      const fetchApi = async () => {
        trigger({ email: inputEmail });
      };
      fetchApi();
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
      <div className={styles.forgot}>
        <div className={styles.forgot__top}>
          <button
            className={styles.forgot__top__back}
            onClick={() => {
              dispatch({ type: "form/closeForgotOpenLogin" });
            }}
          >
            Retour à la connection
          </button>
          <button
            className={styles.forgot__top__close}
            onClick={() => {
              dispatch({
                type: "form/closeForgot",
              });
            }}
          >
            <span className={styles.forgot__top__close__cross}>&times;</span>
          </button>
        </div>
        <h1 className={styles.forgot__h1}>Réinitialisation du mot de passe</h1>

        <form
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
          className={styles.forgot__form}
        >
          <TextField
            value={inputEmail}
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
                setValidInputEmail,
                setInputEmailError,
                setInputEmail,
                "Email : doit être un email valide"
              );
            }}
            helperText={inputEmailError}
          />

          <div className={styles.forgot__form__submit}>
            <input
              className={styles.forgot__form__submit__btn}
              type="submit"
              value="Récupérer son mot de passe"
            />
          </div>
        </form>
        {displayReSendEmail && (
          <div className={styles.forgot__form__submit}>
            <button
              className={styles.forgot__form__submit__btn}
              onClick={() => {
                const fetchApi = async () => {
                  triggerReSend({ email: emailUser });
                };
                fetchApi();
              }}
            >
              Renvoyer un code à l&apos;addresse {emailUser}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Forgot;
