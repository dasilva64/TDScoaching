import React, { useEffect, useState } from "react";
import styles from "./ModalTwoFactor.module.scss";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useGet from "@/app/components/hook/useGet";
import Switch from "@mui/material/Switch";
import fetchGet from "@/app/components/fetch/fetchGet";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";
import validator from "validator";
import Image from "next/image";
import fetchPost from "@/app/components/fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";
import { mutate } from "swr";

const ModalTwoFactor = () => {
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const { displayModalEditTwoFactor } = useSelector(
    (state: RootState) => state.ModalEditTwoFactor
  );
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/api/user/getUserProfile");
  const [codeInput, setCodeInput] = useState<string>("");
  const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
  const [errorMessageCode, setErrorMessageCode] = useState<string>("");

  const clearState = () => {
    setCodeInput("");
    setValidCodeInput(false);
    setErrorMessageCode("");
    setInputPseudo("");
  };
  const {
    data: dataEdit,
    trigger: triggerEdit,
    reset: resetEdit,
  } = useSWRMutation("/api/user/editTwoFactor", fetchPost);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (dataEdit) {
      if (dataEdit.status === 200) {
        dispatch({
          type: "ModalEditTwoFactor/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataEdit.message },
        });
        clearState();
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
        {
          ...dataEdit,
        },
        { revalidate: false }
      );
      resetEdit();
    };
    if (dataEdit && dataEdit.body) {
      mutateMainData();
    }
  }, [dataEdit, mutate, resetEdit]);
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalCancelTwoFactor/open",
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
      <AnimatePresence>
        {displayModalEditTwoFactor === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalTwoFactor}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: "-50%",
                x: "-50%",
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: 200,
                x: "-50%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <button
                className={styles.modalTwoFactor__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalTwoFactor__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalTwoFactor__h1}>
                Modifier l&apos;authentification à deux facteurs
              </h1>
              <form
                className={styles.modalTwoFactor__form}
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <TextField
                  autoFocus
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
                <div className={styles.modalTwoFactor__form__submit}>
                  <input
                    className={styles.modalTwoFactor__form__submit__btn}
                    type="submit"
                    value="Entrez"
                  />
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalTwoFactor;
