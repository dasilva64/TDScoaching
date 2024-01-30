import { AppDispatch, RootState } from "../../../../../../src/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserFirstnameData.module.scss";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import PersonIcon from "@mui/icons-material/Person";
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import fetchPost from "../../../../../../src/app/components/fetch/FetchPost";
import useGet from "../../../../components/hook/useGet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";

const ModalUserFirstnameData = () => {
  const router = useRouter();
  const { displayModalEditFirstname } = useSelector(
    (state: RootState) => state.ModalEditFirstname
  );
  const {
    data: userData,
    isLoading,
    mutate,
  } = useGet("/profile/components/api");
  const dispatch = useDispatch<AppDispatch>();

  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [firstnameInput, setFirstnameInput] = useState<string>("");
  useEffect(() => {
    if (isLoading) {
      setFirstnameInput("");
    } else {
      if (userData) {
        if (userData.status === 200) {
          setFirstnameInput(userData.body.firstname);
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
  const [validFirstnameInput, setValidFirstnameInput] = useState<boolean>(true);
  const [errorMessageFirstname, setErrorMessageFirstname] =
    useState<string>("");

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/firstnameData/modal/api",
    fetchPost
  );
  useEffect(() => {
    const clearState = () => {
      setErrorMessageFirstname("");
      setValidFirstnameInput(true);
      if (userData) {
        if (userData.body) {
          setFirstnameInput(userData.body.firstname);
        }
      }
    };
    if (data) {
      if (data.status === 200) {
        mutate(
          {
            ...data,
            body: {
              ...data.body,
              firstname: firstnameInput,
            },
          },
          {
            revalidate: false,
          }
        );
        reset();
        if (isMutating === false) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          dispatch({
            type: "ModalEditFirstname/close",
          });
          clearState();
        }
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "firstname") {
              setErrorMessageFirstname(element[1]);
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
        router.push("/");
      }
    }
  }, [
    data,
    dispatch,
    firstnameInput,
    isMutating,
    mutate,
    reset,
    router,
    userData,
  ]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalEditFirstname/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validFirstnameInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({
            firstname: validator.escape(firstnameInput.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchLogin();
      }
    } else {
      if (validFirstnameInput === false) {
        if (firstnameInput.length === 0) {
          setErrorMessageFirstname("Prénom : ne peut pas être vide");
        } else {
          setErrorMessageFirstname(
            "Prénom : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
          );
        }
      }
    }
  };
  const clearState = () => {
    setErrorMessageFirstname("");
    setValidFirstnameInput(true);
    if (userData) {
      if (userData.body) {
        setFirstnameInput(userData.body.firstname);
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
        {displayModalEditFirstname === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalEditMainUserData}
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
                className={styles.modalEditMainUserData__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalEditMainUserData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalEditMainUserData__h1}>
                Modifier votre prénom
              </h1>
              <form
                className={styles.modalEditMainUserData__form}
                action=""
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <FormControl
                  variant="standard"
                  className={
                    styles.modalEditMainUserData__form__input__firstname__control
                  }
                >
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-firstname"
                  >
                    Prénom
                  </InputLabel>
                  <Input
                    autoFocus
                    id="standard-adornment-firstname"
                    value={firstnameInput}
                    placeholder={"Entrez votre prénom"}
                    type={"text"}
                    onChange={(e) => {
                      handlerInput(
                        e,
                        "firstname",
                        /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/,
                        setValidFirstnameInput,
                        setErrorMessageFirstname,
                        setFirstnameInput,
                        "Prénom : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <PersonIcon
                          aria-label="toggle firstname visibility"
                          sx={{ padding: "0px", color: "black" }}
                        >
                          <Visibility />
                        </PersonIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText
                    className={
                      styles.modalEditMainUserData__form__input__firstname__helperText
                    }
                  >
                    {errorMessageFirstname}
                  </FormHelperText>
                </FormControl>
                {/* <TextField
                  autoFocus
                  value={firstnameInput}
                  style={{ margin: "20px 0px 0px 0px" }}
                  id={"firstname"}
                  label={"Prénom"}
                  variant="standard"
                  type={"text"}
                  placeholder={"Entrez votre prénom"}
                  FormHelperTextProps={{ style: { color: "red" } }}
                  onChange={(e) => {
                    handlerInput(
                      e,
                      "firstname",
                      /^[A-Za-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi ]{3,}$/,
                      setValidFirstnameInput,
                      setErrorMessageFirstname,
                      setFirstnameInput,
                      "Prénom : 3 lettres minimum"
                    );
                  }}
                  helperText={errorMessageFirstname}
                /> */}
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalEditMainUserData__form__input__pseudo}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <div className={styles.modalEditMainUserData__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalEditMainUserData__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalEditMainUserData__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalEditMainUserData__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalEditMainUserData__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <input
                        className={
                          styles.modalEditMainUserData__form__submit__btn
                        }
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

export default ModalUserFirstnameData;
