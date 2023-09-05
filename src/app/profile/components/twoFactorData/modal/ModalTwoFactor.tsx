import React, { useEffect, useState } from "react";
import styles from "./ModalTwoFactor.module.scss";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import useGet from "@/app/components/hook/useGet";
import Switch from "@mui/material/Switch";
import fetchGet from "@/app/components/fetch/fetchGet";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { TextField } from "@mui/material";
import validator from "validator";
import fetchPost from "@/app/components/fetch/FetchPost";

const ModalTwoFactor = () => {
  const [inputPseudo, setInputPseudo] = useState<string>("");

  const [codeInput, setCodeInput] = useState<string>("");
  const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
  const [errorMessageCode, setErrorMessageCode] = useState<string>("");
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserProfile");
  const [displayInput, setdisplayInput] = useState(false);
  const { data, trigger } = useSWRMutation(
    "/api/user/sendTokenTwoFactor",
    fetchGet
  );
  const { data: dataEdit, trigger: triggerEdit } = useSWRMutation(
    "/api/user/editTwoFactor",
    fetchPost
  );

  const { data: dataDisable, trigger: triggerDisable } = useSWRMutation(
    "/api/user/disableTwoFactor",
    fetchGet
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (dataDisable) {
      if (dataDisable.status === 200) {
        dispatch({
          type: "form/closeModalTwoFactor",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: dataDisable.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataDisable.message },
        });
      }
    }
  }, [dataDisable, dispatch]);
  useEffect(() => {
    const mutateMainData = async () => {
      mutate(
        "/api/user/getUserProfile",
        {
          ...dataDisable,
        },
        { revalidate: false }
      );
    };
    if (dataDisable && dataDisable.body) {
      mutateMainData();
    }
  }, [dataDisable]);
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        setdisplayInput(true);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: data.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (dataEdit) {
      if (dataEdit.status === 200) {
        setdisplayInput(false);
        dispatch({
          type: "form/closeModalTwoFactor",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: dataEdit.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataEdit.message },
        });
      }
    }
  }, [dataEdit, dispatch]);

  useEffect(() => {
    const mutateMainData = async () => {
      mutate(
        "/api/user/getUserProfile",
        {
          ...dataEdit,
        },
        { revalidate: false }
      );
    };
    if (dataEdit && dataEdit.body) {
      mutateMainData();
    }
  }, [dataEdit]);
  const closeForm = () => {
    dispatch({
      type: "form/closeModalTwoFactor",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validCodeInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          triggerEdit({
            code: validator.escape(codeInput.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchLogin();
      }
    } else {
      if (validCodeInput === false) {
        setErrorMessageCode("Code : ne doit pas être vide");
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
    let removeSpace = "";
    if (e.target.value.charAt(0) === " ") {
      removeSpace = e.target.value.replace(/\s/, "");
      setInput(removeSpace);
    } else {
      removeSpace = e.target.value.replace(/\s+/g, " ");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      setValidInput(true);
      setErrorMessage("");
    } else if (removeSpace.length === 0) {
      setValidInput(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setErrorMessage(errorMessage);
    }
  };
  return (
    <>
      <div className={styles.bg}></div>
      <div className={styles.modalTwoFactor}>
        <button
          className={styles.modalTwoFactor__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalTwoFactor__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalTwoFactor__h1}>
          Modifier l&apos;authentification à deux facteurs
        </h1>
        {displayInput === false && (
          <Switch
            checked={userData.body.twoFactor}
            onChange={(e) => {
              if (e.target.checked === true) {
                trigger();
              } else {
                triggerDisable();
              }
            }}
          />
        )}
        {displayInput === true && (
          <form
            onSubmit={(e) => {
              handlerSubmit(e);
            }}
          >
            <TextField
              value={codeInput}
              style={{ margin: "20px 0px 0px 0px" }}
              id={"code"}
              label={"Code"}
              variant="standard"
              type={"text"}
              placeholder={"Entrez votre code"}
              FormHelperTextProps={{ style: { color: "red" } }}
              onChange={(e) => {
                handlerInput(
                  e,
                  "firstname",
                  /^[0-9]{8,8}$/,
                  setValidCodeInput,
                  setErrorMessageCode,
                  setCodeInput,
                  "Code : 8 chiffres"
                );
              }}
              helperText={errorMessageCode}
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
            <div className={styles.modalEditMainUserData__form__submit}>
              <input
                className={styles.modalEditMainUserData__form__submit__btn}
                type="submit"
                value="Entrez"
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ModalTwoFactor;
