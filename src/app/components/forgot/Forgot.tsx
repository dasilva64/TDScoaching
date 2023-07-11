import React, { useEffect, useState } from "react";
import styles from "./Forgot.module.scss";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import GroupForm from "../form/group";
import fetchUserForgotEmail from "../hook/useForgot";
import useSWRMutation from "swr/mutation";

const Forgot = () => {
  const [inputEmail, setInputEmail] = useState<string>("");
  const [validInputEmail, setValidInputEmail] = useState<boolean>(false);
  const [inputEmailError, setInputEmailError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/forgot",
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
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
      }
    }
  }, [data, dispatch]);
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
          <GroupForm
            nameLabel={"Email"}
            typeInput={"email"}
            nameInput={"email"}
            errorMessageInput={"Email : doit avoir un format valide"}
            regex={/^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/}
            setInputValue={setInputEmail}
            setValidInput={setValidInputEmail}
            errorMessage={inputEmailError}
            setErrorMessage={setInputEmailError}
          />

          <div className={styles.forgot__form__submit}>
            <input
              className={styles.forgot__form__submit__btn}
              type="submit"
              value="Récupérer son mot de passe"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Forgot;
