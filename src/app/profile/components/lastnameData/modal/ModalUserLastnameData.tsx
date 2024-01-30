import { AppDispatch, RootState } from "../../../../../../src/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserLastnameData.module.scss";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import fetchPost from "../../../../../../src/app/components/fetch/FetchPost";
//import useGet from "../../../../components/hook/useGet";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import useGet from "@/app/components/hook/useGet";

const ModalUserLastnameData = () => {
  const { displayModalEditLastname } = useSelector(
    (state: RootState) => state.ModalEditLastname
  );
  const {
    data: userData,
    isLoading,
    mutate,
  } = useGet("/profile/components/api");
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [lastnameInput, setLastnameInput] = useState<string>("");
  useEffect(() => {
    if (isLoading) {
      setLastnameInput("");
    } else {
      if (userData) {
        if (userData.status === 200) {
          setLastnameInput(userData.body.lastname);
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
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(true);
  const [errorMessageLastname, setErrorMessageLastname] = useState<string>("");

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/lastnameData/modal/api",
    fetchPost
  );

  useEffect(() => {
    const clearState = () => {
      setErrorMessageLastname("");
      setValidLastnameInput(true);
      if (userData) {
        if (userData.body) {
          setLastnameInput(userData.body.lastname);
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
              lastname: lastnameInput,
            },
          },
          { revalidate: false }
        );
        reset();
        if (isMutating === false) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          dispatch({
            type: "ModalEditLastname/close",
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
            if (element[0] === "lastname") {
              setErrorMessageLastname(element[1]);
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
    isMutating,
    lastnameInput,
    mutate,
    reset,
    router,
    userData,
  ]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalEditLastname/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validLastnameInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({
            lastname: validator.escape(lastnameInput.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchLogin();
      }
    } else {
      if (validLastnameInput === false) {
        if (lastnameInput.length === 0) {
          setErrorMessageLastname("Nom de famille : ne peut pas être vide");
        } else {
          setErrorMessageLastname(
            "Nom de famille : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
          );
        }
      }
    }
  };
  const clearState = () => {
    setErrorMessageLastname("");
    setValidLastnameInput(true);
    if (userData) {
      if (userData.body) {
        setLastnameInput(userData.body.lastname);
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
        {displayModalEditLastname === true && (
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
                Modifier votre nom de famille
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
                    styles.modalEditMainUserData__form__input__lastname__control
                  }
                >
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-lastname"
                  >
                    Nom de famille
                  </InputLabel>
                  <Input
                    autoFocus
                    id="standard-adornment-lastname"
                    value={lastnameInput}
                    placeholder={"Entrez votre nom de famille"}
                    type={"text"}
                    onChange={(e) => {
                      handlerInput(
                        e,
                        "lastname",
                        /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/,
                        setValidLastnameInput,
                        setErrorMessageLastname,
                        setLastnameInput,
                        "Nom de famille : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <PersonIcon
                          aria-label="toggle lastname visibility"
                          sx={{ padding: "0px", color: "black" }}
                        >
                          <Visibility />
                        </PersonIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText
                    className={
                      styles.modalEditMainUserData__form__input__lastname__helperText
                    }
                  >
                    {errorMessageLastname}
                  </FormHelperText>
                </FormControl>

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

export default ModalUserLastnameData;
