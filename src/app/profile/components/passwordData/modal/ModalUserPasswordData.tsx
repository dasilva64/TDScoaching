import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserPasswordData.module.scss";
import useSWRMutation from "swr/mutation";
import fetchPost from "../../../../components/fetch/FetchPost";
import Image from "@/app/components/image/Image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Input from "@/app/components/input/Input";
import { mutate as globalMutate } from "swr";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState, AppDispatch } from "@/app/redux/store/store";

const ModalUserPasswordData = ({ mutate }: any) => {
  const { displayModalEditPassword } = useSelector(
    (state: RootState) => state.ModalEditPassword
  );
  const { csrfToken } = useSelector(
    (state: RootState) => state.csrfToken
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
  const router = useRouter();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/passwordData/modal/api",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalEditPassword/close",
        });
        globalMutate("/components/header/api");
        mutate()
        reset();
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=profile`);
      } else if (data.status === 400) {
        if (data.type === "validation") {
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
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, reset, router, mutate]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalEditPassword/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validPasswordInput === true && validPasswordComfirmInput === true) {
      if (passwordInput === passwordComfirmInput) {
        if (inputPseudo.length === 0) {
          const fetchLogin = async () => {
            trigger({
              password: passwordInput,
              passwordComfirm: passwordComfirmInput,
              pseudo: inputPseudo,
              csrfToken: csrfToken
            });
          };
          fetchLogin();
        }
      } else {
        setValidPasswordInput(false);
        setValidPasswordComfirmInput(false);
        setErrorMessagePasswordComfirm(
          "Confirmation mot de passe : les mots de passe sont identiques"
        );
      }
    } else {
      if (validPasswordInput === false) {
        if (passwordInput.length === 0) {
          setErrorMessagePassword("Mot de passe : ne peut pas être vide");
        }
      }
      if (validPasswordComfirmInput === false) {
        if (passwordComfirmInput.length === 0) {
          setErrorMessagePasswordComfirm(
            "Confirmation mot de passe : ne peut pas être vide"
          );
        }
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
    /* if (regex.test(removeSpace)) {
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
      } else if (
        passwordComfirmInput.length > 0 &&
        removeSpace === passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
      } else {
        setValidInput(true);
        setErrorMessage("");
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
    } */
    if (regex.test(removeSpace)) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else if (
        passwordComfirmInput.length > 0 &&
        removeSpace === passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
      } else {
        setValidInput(true);
        setErrorMessage("");
      }
    } else if (removeSpace.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage("");
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
      }
    } else {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setErrorMessagePasswordComfirm(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage(errorMessage);
        //setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(false);
      }
    }
  };
  const clearState = () => {
    setShowPassword(false);
    setShowPasswordComfirm(false);
    setErrorMessagePassword("");
    setErrorMessagePasswordComfirm("");
    setValidPasswordInput(false);
    setValidPasswordComfirmInput(false);
    setPasswordInput("");
    setPasswordComfirmInput("");
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordComfirm, setShowPasswordComfirm] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPasswordComfirm = () =>
    setShowPasswordComfirm((show) => !show);

  return (
    <>
      <TabIndex displayModal={displayModalEditPassword} />
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
                type="button"
                className={styles.modalEditPasswordData__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.modalEditPasswordData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalEditPasswordData__h1}`}>
                Modifier votre mot de passe
              </h2>
              <form
                className={styles.modalEditPasswordData__form}
                action=""
                method="POST"
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <Input
                  label={"Mot de passe"}
                  value={passwordInput}
                  id={"password"}
                  type={"password"}
                  placeholder={"Entrez votre mot de passe"}
                  onchange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    handlerInput(
                      e,
                      "password",
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#=&,_])[A-Za-z\d-?!*:@~%.;+|$#=&,_]{12,}$/,
                      setValidPasswordInput,
                      setErrorMessagePassword,
                      setPasswordInput,
                      "Mot de passe : doit avoir une lettre en minuscule, majuscule, un nombre, un caractère spécial (-?!*:@~%)(.;+{\"|$#}=['&,_) et 12 caractères minimum"
                    );
                  }}
                  validInput={validPasswordInput}
                  errorMessage={errorMessagePassword}
                  image={"eye-solid"}
                  alt={"icone afficher mot de passe"}
                  position={"first"}
                  tab={true}
                />
                <Input
                  label={"Confirmation de mot de passe"}
                  value={passwordComfirmInput}
                  id={"comfirmPassword"}
                  type={"password"}
                  placeholder={"Entrez votre confirmation de mot de passe"}
                  onchange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
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
                        "Confirmation mot de passe : les mots de passe doivent être identiques"
                      );
                    } else {
                      setValidPasswordComfirmInput(true);

                      setErrorMessagePasswordComfirm("");
                    }
                  }}
                  validInput={validPasswordComfirmInput}
                  errorMessage={errorMessagePasswordComfirm}
                  image={"eye-solid"}
                  alt={"icone afficher mot de passe"}
                  tab={true}
                />

                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalEditPasswordData__form__hidden}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <div className={styles.modalEditPasswordData__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalEditPasswordData__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalEditPasswordData__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalEditPasswordData__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalEditPasswordData__form__submit__btn__load__arc__circle
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
                          styles.modalEditPasswordData__form__submit__btn
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

export default ModalUserPasswordData;
