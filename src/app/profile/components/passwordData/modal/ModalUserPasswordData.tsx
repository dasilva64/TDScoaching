import { AppDispatch, RootState } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserPasswordData.module.scss";
import GroupForm from "@/app/components/form/group";
import fetchEditPasswordData from "@/app/components/hook/user/useEditPasswordData";
import useSWRMutation from "swr/mutation";

const ModalUserPasswordData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [passwordInput, setPasswordInput] = useState<string>(
    ""
  );
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>(
    ""
  );
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");
  const [errorMessagePasswordComfirm, setErrorMessagePasswordComfirm] =
    useState<string>("");

  const {trigger, data} = useSWRMutation('http://localhost:8080/user/editPassword', fetchEditPasswordData)


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
          trigger({password: passwordInput})
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
          Modification des informations principales
        </h1>
        <form
          className={styles.modalEditPasswordData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <GroupForm
            nameLabel={"Mot de passe"}
            typeInput={"password"}
            nameInput={"password"}
            errorMessageInput={
              "Mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
            }
            regex={/^(?=.*[a-z]).{1,}$/}
            inputValue={passwordInput}
            setInputValue={setPasswordInput}
            setValidInput={setValidPasswordInput}
            errorMessage={errorMessagePassword}
            setErrorMessage={setErrorMessagePassword}
          />
          <GroupForm
            nameLabel={"Comfirmation mot de passe"}
            typeInput={"password"}
            nameInput={"comfirmPassword"}
            errorMessageInput={
              "Comfirmation mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
            }
            regex={/^(?=.*[a-z]).{1,}$/}
            inputValue={passwordComfirmInput}
            setInputValue={setPasswordComfirmInput}
            setValidInput={setValidPasswordComfirmInput}
            errorMessage={errorMessagePasswordComfirm}
            setErrorMessage={setErrorMessagePasswordComfirm}
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
