import { AppDispatch, RootState } from "../../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserPasswordData.module.scss";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";
import fetchPost from "@/app/components/fetch/FetchPost";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const ModalUserPasswordData = () => {
  const { displayModalEditPassword } = useSelector(
    (state: RootState) => state.ModalEditPassword
  );
  const dispatch = useDispatch<AppDispatch>();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>("");
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");
  const [errorMessagePasswordComfirm, setErrorMessagePasswordComfirm] =
    useState<string>("");

  const { trigger, data, reset } = useSWRMutation(
    "/api/user/editPasswordUser",
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
          type: "ModalEditPassword/close",
        });
        reset();
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "password") {
            setErrorMessagePassword(element[1]);
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
    }
  }, [data, dispatch, reset]);

  const closeForm = () => {
    dispatch({
      type: "ModalEditPassword/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validPasswordInput === true || validPasswordComfirmInput === true) {
      if (passwordInput === passwordComfirmInput) {
        if (inputPseudo.length === 0) {
          const fetchLogin = async () => {
            trigger({ password: passwordInput, pseudo: inputPseudo });
          };
          fetchLogin();
        }
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
      removeSpace = e.target.value.replace(/\s+/g, "");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
      }
    } else if (removeSpace.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
        setValidInput(false);
        setErrorMessage("");
      }
    } else {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
        setValidInput(false);
        setErrorMessage(errorMessage);
      }
    }
  };
  return (
    <>
      <AnimatePresence>
        {displayModalEditPassword === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalEditPasswordData}
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
                className={styles.modalEditPasswordData__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalEditPasswordData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalEditPasswordData__h1}>
                Modification de votre mot de passe
              </h1>
              <form
                className={styles.modalEditPasswordData__form}
                action=""
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <TextField
                  autoFocus
                  value={passwordInput}
                  style={{ margin: "20px 0px 0px 0px" }}
                  id={"password"}
                  label={"Mot de passe"}
                  variant="standard"
                  type={"password"}
                  placeholder={"Entrez votre mot de passe"}
                  FormHelperTextProps={{ style: { color: "red" } }}
                  onChange={(e) => {
                    handlerInput(
                      e,
                      "password",
                      /^(?=.*[a-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi]).{2,}$/,
                      setValidPasswordInput,
                      setErrorMessagePassword,
                      setPasswordInput,
                      "Mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
                    );
                  }}
                  helperText={errorMessagePassword}
                />
                <TextField
                  value={passwordComfirmInput}
                  style={{ margin: "20px 0px" }}
                  id={"comfirmPassword"}
                  label={"Comfirmation mot de passe"}
                  variant="standard"
                  type={"password"}
                  placeholder={"Entrez votre comfirmation mot de passe"}
                  FormHelperTextProps={{ style: { color: "red" } }}
                  onChange={(e) => {
                    let removeSpace = "";
                    if (e.target.value.charAt(0) === " ") {
                      removeSpace = e.target.value.replace(/\s/, "");
                      setPasswordComfirmInput(removeSpace);
                    } else {
                      removeSpace = e.target.value.replace(/\s+/g, "");
                      setPasswordComfirmInput(removeSpace);
                    }
                    if (
                      passwordInput.length > 0 &&
                      removeSpace !== passwordInput
                    ) {
                      setValidPasswordComfirmInput(false);
                      setErrorMessagePasswordComfirm(
                        "Comfirmation mot de passe : les mots de passe doivent être identique"
                      );
                    } else {
                      setValidPasswordComfirmInput(true);

                      setErrorMessagePasswordComfirm("");
                    }
                  }}
                  helperText={errorMessagePasswordComfirm}
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
                <div className={styles.modalEditPasswordData__form__submit}>
                  <input
                    className={styles.modalEditPasswordData__form__submit__btn}
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

export default ModalUserPasswordData;
