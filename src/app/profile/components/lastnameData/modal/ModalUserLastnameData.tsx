import { AppDispatch, RootState } from "../../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserLastnameData.module.scss";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import { TextField } from "@mui/material";
import fetchPost from "@/app/components/fetch/FetchPost";
import useGet from "@/app/components/hook/useGet";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const ModalUserLastnameData = () => {
  const { displayModalEditLastname } = useSelector(
    (state: RootState) => state.ModalEditLastname
  );
  const {
    data: userData,
    isLoading,
    mutate,
  } = useGet("/api/user/getUserProfile");
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [lastnameInput, setLastnameInput] = useState<string>("");
  useEffect(() => {
    if (isLoading) {
      setLastnameInput("");
    } else {
      if (userData) {
        if (userData.status === 200) {
          setLastnameInput(userData.body.lastname);
        } else {
          setLastnameInput("");
        }
      }
    }
  }, [isLoading, userData]);
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(true);
  const [errorMessageLastname, setErrorMessageLastname] = useState<string>("");

  const { trigger, data, reset } = useSWRMutation(
    "/api/user/editLastnameUser",
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
          type: "ModalEditLastname/close",
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "lastname") {
            setErrorMessageLastname(element[1]);
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
            lastname: lastnameInput,
          },
        },
        { revalidate: false }
      );
      reset();
    };
    if (data && data.body) {
      mutateMainData();
    }
  }, [data, lastnameInput, mutate, reset]);

  const closeForm = () => {
    dispatch({
      type: "ModalEditLastname/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (
        userData.body.lastname !== lastnameInput &&
        validLastnameInput === false
      ) {
        setErrorMessageLastname("Nom de famille : ne doit pas être vide");
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
                <TextField
                  autoFocus
                  value={lastnameInput}
                  style={{ margin: "20px 0px" }}
                  id={"lastname"}
                  label={"Nom de famille"}
                  variant="standard"
                  type={"text"}
                  placeholder={"Entrez votre nom de famille"}
                  FormHelperTextProps={{ style: { color: "red" } }}
                  onChange={(e) => {
                    handlerInput(
                      e,
                      "lastname",
                      /^[A-Za-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi ]{3,}$/,
                      setValidLastnameInput,
                      setErrorMessageLastname,
                      setLastnameInput,
                      "Nom de famille : 3 lettres minimum"
                    );
                  }}
                  helperText={errorMessageLastname}
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

export default ModalUserLastnameData;
