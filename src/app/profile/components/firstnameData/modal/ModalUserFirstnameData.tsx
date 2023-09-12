import { AppDispatch, RootState } from "../../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserFirstnameData.module.scss";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import { TextField } from "@mui/material";
import fetchPost from "@/app/components/fetch/FetchPost";
import useGet from "@/app/components/hook/useGet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const ModalUserFirstnameData = () => {
  const { displayModalEditFirstname } = useSelector(
    (state: RootState) => state.ModalEditFirstname
  );
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/api/user/getUserProfile");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  /* if (isError) {
    dispatch({
      type: "flash/storeFlashMessage",
      payload: {
        type: "error",
        flashMessage: "Erreur lors du chargement, veuillez réessayer",
      },
    });
    router.push("/");
  } else if (isLoading) {
  } */

  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [firstnameInput, setFirstnameInput] = useState<string>("");
  useEffect(() => {
    if (isLoading) {
      setFirstnameInput("");
    } else {
      if (userData) {
        if (userData.status === 200) {
          setFirstnameInput(userData.body.firstname);
        } else {
          setFirstnameInput("");
        }
      }
    }
  }, [isLoading, userData]);
  const [validFirstnameInput, setValidFirstnameInput] = useState<boolean>(true);
  const [errorMessageFirstname, setErrorMessageFirstname] =
    useState<string>("");

  const { trigger, data, reset } = useSWRMutation(
    "/api/user/editFirstnameUser",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalEditFirstname/close",
        });
        clearState();
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "firstname") {
            setErrorMessageFirstname(element[1]);
          }
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
    const mutateMainData = async () => {
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
    };
    if (data && data.body) {
      mutateMainData();
    }
  }, [data, firstnameInput, mutate, reset]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalEditFirstname/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (
        userData.body.firstname !== firstnameInput &&
        validFirstnameInput === false
      ) {
        setErrorMessageFirstname("Prénom : ne doit pas être vide");
      }
    }
  };
  const clearState = () => {
    setErrorMessageFirstname("");
    setValidFirstnameInput(false);
    setFirstnameInput("");
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
                <TextField
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
                    value="Modifier"
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

export default ModalUserFirstnameData;
