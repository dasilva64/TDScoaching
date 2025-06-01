import React, { useEffect, useState } from "react";
import styles from "./ModalUserSendToken.module.scss";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import fetchPost from "../../../../components/fetch/FetchPost";
import Image from "@/app/components/image/Image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Input from "@/app/components/input/Input";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState, AppDispatch } from "@/app/redux/store";

const ModalUserSendToken = ({ data: userData, mutate }: any) => {
  const { displayModalSendTokenEmail, inputEmail } = useSelector(
    (state: RootState) => state.ModalSendTokenEmail
  );
  console.log(inputEmail)
  const { csrfToken } = useSelector(
    (state: RootState) => state.csrfToken
  );
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const [emailInput, setEmailInput] = useState<string>(inputEmail !== "" ? inputEmail : userData.body.email);

  const [validEmailInput, setValidEmailInput] = useState<boolean>(true);
  const [errorMessageEmail, setErrorMessageEmail] = useState<string>("");
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/emailSendTokenData/modal/api",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate(
          {
            ...data,
            body: {
              ...data.body,
              newEmail: emailInput
            },
          },
          {
            revalidate: false,
          }
        );
        dispatch({
          type: "csrfToken/store",
          payload: { csrfToken: data.csrfToken },
        });
        dispatch({
          type: "ModalSendTokenEmail/close",
          payload: {inputEmail: userData?.body.email}
        });
        dispatch({
          type: "ModalEditEmail/open",
        });
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
      payload: {inputEmail: userData.body.email}
    });
  };
  /*   useEffect(() => {
    if (emailInput && emailInput?.length > 0) {
      setValidEmailInput(true);
    }
  }, [emailInput, emailInput?.length]); */
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
            csrfToken: csrfToken
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
    /* if (userData) {
      if (userData.body) {
        setEmailInput(userData.body.email);
      }
    } */
  };
  return (
    <>
      <TabIndex displayModal={displayModalSendTokenEmail} />
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
                type="button"
                className={styles.modalEditEmailData__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.modalEditEmailData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalEditEmailData__h1}`}>
                Modifier votre addresse mail
              </h2>
              <form
                className={styles.modalEditEmailData__form}
                action=""
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <Input
                  label={"Email"}
                  value={emailInput}
                  id={"email"}
                  type={"text"}
                  placeholder={"Entrez votre email"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                  validInput={validEmailInput}
                  errorMessage={errorMessageEmail}
                  image={"at-solid"}
                  alt={"icone email"}
                  position={"first"}
                  tab={true}
                />
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalEditEmailData__form__hidden}
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
