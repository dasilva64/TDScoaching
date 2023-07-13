import React, { useEffect, useState } from "react";
import styles from "./ModalUserSendToken.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import GroupForm from "../../../../components/form/group";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetchEditSendToken from "../../../../components/hook/user/useEditEmailSendTokenData";
import { TextField } from "@mui/material";
import useUserGet from "../../../../components/hook/useUserGet";

const ModalUserSendToken = () => {
  const {userData} = useUserGet()
  const dispatch = useDispatch<AppDispatch>();
  const [emailInput, setEmailInput] = useState<string>(userData?.body.email);
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/editEmailSendToken",
    fetchEditSendToken
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        console.log(data);
        const mutateUser = async () => {
          mutate(
            "/api/user/get",
            {
              ...data,
              body: {
                ...data.body,
                editEmail: {
                  newEmail: data.newData.newEmail,
                  limitDate: data.newData.limitDate,
                },
              },
            },
            { revalidate: false }
          );
        };
        mutateUser();
        dispatch({
          type: "form/openModalEditEmailData",
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
      type: "form/closeModalEditEmailSendData",
    });
  };
  useEffect(() => {
    if (emailInput && emailInput.length > 0) {
      setValidEmailInput(true);
    }
  }, [emailInput, emailInput.length]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validEmailInput === true) {
      const fetchLogin = async () => {
        trigger({ mail: emailInput });
      };
      fetchLogin();
    } else {
      if (validEmailInput === false) {
        setErrorMessageEmail("Email : doit avoir un format valide");
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
      <div className={styles.modalEditEmailData}>
        <button
          className={styles.modalEditEmailData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditEmailData__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalEditEmailData__h1}>
          Modification de l&apos;addresse mail
        </h1>
        <form
          className={styles.modalEditEmailData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <TextField
            value={emailInput}
            style={{ margin: "30px 0px 40px 0px" }}
            id={"email"}
            label={"Email"}
            variant="standard"
            type={"email"}
            placeholder={"Entrez votre email"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                "firstname",
                /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                setValidEmailInput,
                setErrorMessageEmail,
                setEmailInput,
                "Email : doit avoir un format valide"
              );
            }}
            helperText={errorMessageEmail}
          />
          <div className={styles.modalEditEmailData__form__submit}>
            <input
              className={styles.modalEditEmailData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserSendToken;
