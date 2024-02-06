import React, { useEffect, useState } from "react";
import styles from "./ModalUserSendToken.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../src/app/redux/store";
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
import fetchPost from "../../../../../../src/app/components/fetch/FetchPost";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Image from "next/image";
import useGet from "../../../../components/hook/useGet";
import { AnimatePresence, motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../../../Parisienne-Regular.ttf",
  display: "swap",
});

const ModalUserSendToken = () => {
  const { displayModalSendTokenEmail } = useSelector(
    (state: RootState) => state.ModalSendTokenEmail
  );
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const router = useRouter();
  const {
    data: userData,
    isLoading,
    mutate,
  } = useGet("/profile/components/api");
  const dispatch = useDispatch<AppDispatch>();
  const [emailInput, setEmailInput] = useState<string>("");
  useEffect(() => {
    if (isLoading) {
      setEmailInput("");
    } else {
      if (userData) {
        if (userData.status === 200) {
          setEmailInput(userData.body.email);
        } else if (userData.status === 401) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: {
              type: "error",
              flashMessage: userData.message,
            },
          });
          router.push("/");
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: {
              type: "error",
              flashMessage: userData.message,
            },
          });
          router.push("/");
        }
      }
    }
  }, [dispatch, isLoading, router, userData]);
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState<string>("");

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/emailSendTokenData/modal/api",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate();
        dispatch({
          type: "ModalSendTokenEmail/close",
        });
        dispatch({
          type: "ModalEditEmail/open",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        setEmailInput(userData.body.email);
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
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "email") {
              setErrorMessageEmail(element[1]);
            }
          });
          reset();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, mutate, reset, router, userData]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalSendTokenEmail/close",
    });
  };
  useEffect(() => {
    if (emailInput && emailInput?.length > 0) {
      setValidEmailInput(true);
    }
  }, [emailInput, emailInput?.length]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validEmailInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({
            email: validator.escape(emailInput.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchLogin();
      }
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
    let removeSpace = "";
    if (e.target.value.charAt(0) === " ") {
      removeSpace = e.target.value.replace(/\s/, "");
      setInput(removeSpace);
    } else {
      removeSpace = e.target.value.replace(/\s+/g, " ");
      setInput(removeSpace);
    }
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

  const clearState = () => {
    setErrorMessageEmail("");
    setValidEmailInput(false);
    /* if (userData) {
      if (userData.body) {
        setEmailInput(userData.body.email);
      }
    } */
  };
  return (
    <>
      <AnimatePresence>
        {displayModalSendTokenEmail === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              onClick={() => closeForm()}
              className={styles.bg}
            />
            <motion.div
              className={styles.modalEditEmailData}
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
                className={styles.modalEditEmailData__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalEditEmailData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2
                className={`${styles.modalEditEmailData__h1} ${Parisienne.className}`}
              >
                Modifier votre addresse mail
              </h2>
              <form
                className={styles.modalEditEmailData__form}
                action=""
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <FormControl
                  variant="standard"
                  style={{ margin: "30px 0px 40px 0px" }}
                >
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-email"
                  >
                    Email
                  </InputLabel>
                  <Input
                    autoFocus
                    id="standard-adornment-email"
                    value={emailInput}
                    placeholder={"Entrez votre mail"}
                    type={"text"}
                    onChange={(e) => {
                      handlerInput(
                        e,
                        "email",
                        /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                        setValidEmailInput,
                        setErrorMessageEmail,
                        setEmailInput,
                        "Email : doit avoir un format valide"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <AlternateEmailIcon
                          sx={{ color: "black" }}
                          aria-label="toggle email visibility"
                        >
                          <Visibility />
                        </AlternateEmailIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errorMessageEmail}
                  </FormHelperText>
                </FormControl>
                {/* <TextField
                  autoFocus
                  value={emailInput}
                  style={{ margin: "30px 0px 40px 0px" }}
                  id={"email"}
                  label={"Email"}
                  variant="standard"
                  type={"text"}
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
                <div className={styles.modalEditEmailData__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalEditEmailData__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalEditEmailData__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalEditEmailData__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalEditEmailData__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <input
                        className={styles.modalEditEmailData__form__submit__btn}
                        type="submit"
                        value="Modifier"
                      />
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalUserSendToken;
