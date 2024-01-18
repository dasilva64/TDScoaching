import React, { useEffect, useState } from "react";
import styles from "./ModalTwoFactor.module.scss";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useGet from "../../../components/hook/useGet";
import useSWRMutation from "swr/mutation";
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import validator from "validator";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import KeyIcon from "@mui/icons-material/Key";
import fetchPost from "../../../../../src/app/components/fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";
import fetchGet from "../../../../../src/app/components/fetch/fetchGet";
//import { mutate } from "swr";
import { useRouter } from "next/navigation";

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
  } = useGet("/profile/components/api");
  const [codeInput, setCodeInput] = useState<string>("");
  const router = useRouter();
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
    isMutating: isMutatingEdit,
  } = useSWRMutation("/profile/components/twoFactorData/api", fetchPost);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (dataEdit) {
      if (dataEdit.status === 200) {
        mutate(
          {
            ...dataEdit,
          },
          { revalidate: false }
        );
        /* mutate(
          "/profile/components/api",
          {
            ...dataEdit,
          },
          { revalidate: false }
        ); */
        resetEdit();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataEdit.message },
        });
        if (isMutatingEdit === false) {
          dispatch({
            type: "ModalEditTwoFactor/close",
          });
          clearState();
        }
      } else if (dataEdit.status === 401) {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: dataEdit.message },
          });
          resetEdit();
        }, 2000);
        router.push("/");
      } else if (dataEdit.status === 400) {
        if (dataEdit.type === "validation") {
          dataEdit.message.forEach((element: string) => {
            if (element[0] === "code") {
              setErrorMessageCode(element[1]);
            }
          });
          resetEdit();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: dataEdit.message },
          });
          resetEdit();
        }
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataEdit.message },
        });
        resetEdit();
      }
    }
  }, [dataEdit, dispatch, isMutatingEdit, mutate, resetEdit, router]);

  const { data, trigger, reset, isMutating } = useSWRMutation(
    "/profile/components/twoFactorSendTokenData/Modal/send/api",
    fetchGet
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        reset();
      } else if (data.status === 401) {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }, 2000);
        router.push("/");
      } else if (data.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, reset, router]);
  /* useEffect(() => {
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
  }, [dataEdit, mutate, resetEdit]); */
  const closeForm = () => {
    //clearState();
    dispatch({
      type: "ModalCancelTwoFactor/open",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
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
              <p>
                Afin de renforcer la sécurité de vos données et de vos
                documents, nous devons vérifier votre adresse email. Nous vous
                avons envoyé un email contenant un code de sécurité à 8
                chiffres.
              </p>
              <form
                className={styles.modalTwoFactor__form}
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <FormControl
                  variant="standard"
                  style={{ margin: "20px 0px 0px 0px" }}
                >
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-code"
                  >
                    Code de validation
                  </InputLabel>
                  <Input
                    autoFocus
                    id="standard-adornment-code"
                    value={codeInput}
                    placeholder={"Entrez votre code"}
                    type={"text"}
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
                    endAdornment={
                      <InputAdornment position="end">
                        <KeyIcon
                          aria-label="toggle code visibility"
                          sx={{ padding: "0px", color: "black" }}
                        >
                          <Visibility />
                        </KeyIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errorMessageCode}
                  </FormHelperText>
                </FormControl>
                {/* <TextField
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
                /> */}
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
                  {isMutatingEdit && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalTwoFactor__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalTwoFactor__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalTwoFactor__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalTwoFactor__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutatingEdit === false && (
                    <>
                      <input
                        className={styles.modalTwoFactor__form__submit__btn}
                        type="submit"
                        value="Activer l'authentification à deux facteurs"
                      />
                    </>
                  )}
                </div>
              </form>
              <div className={styles.modalTwoFactor__reSend}>
                {isMutating && (
                  <>
                    <button
                      disabled
                      className={styles.modalTwoFactor__reSend__btn__load}
                    >
                      <span
                        className={
                          styles.modalTwoFactor__reSend__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.modalTwoFactor__reSend__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.modalTwoFactor__reSend__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  </>
                )}
                {isMutating === false && (
                  <>
                    <button
                      className={styles.modalTwoFactor__reSend__btn}
                      onClick={() => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        clearState();
                        trigger();
                      }}
                    >
                      Renvoyer un code
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalTwoFactor;
