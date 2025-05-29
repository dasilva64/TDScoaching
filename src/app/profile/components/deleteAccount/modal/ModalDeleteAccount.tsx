import React, { useEffect, useRef, useState } from "react";
import styles from "./ModalDeleteAccount.module.scss";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import fetchPost from "../../../../components/fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store";

const ModalDeleteAccount = ({mutate} : any) => {
  const { displayModalDeleteAccount } = useSelector(
    (state: RootState) => state.ModalDeleteAccount
  );
  const { csrfToken } = useSelector(
    (state: RootState) => state.csrfToken
  );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [reasonErrorMessage, setReasonErrorMessage] = useState<string>("");
  const [reasonValid, setReasonValid] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messageInputError, setMessageInputError] = useState<string>("");
  const [validinputMessage, setValidInputMessage] = useState<boolean>(false);
  const { data, trigger, isMutating, reset } = useSWRMutation(
    "/profile/components/deleteAccount/modal/api",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        clearState();
        dispatch({
          type: "csrfToken/store",
          payload: { csrfToken: data.csrfToken },
        });
        mutate()
        if (isMutating === false) {
          dispatch({
            type: "ModalDeleteAccount/close",
          });
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          reset();
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
            if (element[0] === "reason") {
              setReasonErrorMessage(element[1]);
            }
          });
          reset();
        } else if (data.type === "already") {
          setReason("");
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          dispatch({
            type: "ModalDeleteAccount/close",
          });
          reset();
        } else {
          if (
            data.message ===
            "Vous ne pouvez pas supprimer votre compte car vous avez un rendez-vous de prévu"
          ) {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: data.message },
            });
            dispatch({
              type: "ModalDeleteAccount/close",
            });
            reset();
            router.push("/rendez-vous");
          } else {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: data.message },
            });
            reset();
          }
        }
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, isMutating, reset, router]);
  const clearState = () => {
    setReason("");
    setReasonValid(false);
    setReasonErrorMessage("");
    setInputMessage("");
    setMessageInputError("");
    setValidInputMessage(false);
  };
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalDeleteAccount/close",
    });
  };

  const handleChange = (event: any) => {
    setReason(event.target.value);
    if (event.target.value === "") {
      setReasonErrorMessage("Veuillez selectionner une raison");
      setReasonValid(false);
    } else {
      setReasonErrorMessage("");
      setReasonValid(true);
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
      removeSpace = e.target.value.replace(/\s\s+/g, " ");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      setValidInput(true);
      setReasonValid(true);
      setErrorMessage("");
    } else if (removeSpace.length === 0) {
      setValidInput(false);
      setReasonValid(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setReasonValid(false);
      setErrorMessage(errorMessage);
    }
  };
  return (
    <>
      <TabIndex displayModal={displayModalDeleteAccount} />
      <AnimatePresence>
        {displayModalDeleteAccount === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              onClick={() => closeForm()}
              className={styles.bg}
            />
            <motion.div
              className={styles.modalDeleteAccount}
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
                className={styles.modalDeleteAccount__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
                type="button"
              >
                <Image
                  className={styles.modalDeleteAccount__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalDeleteAccount__h1}`}>
                Suppression du compte
              </h2>

              <div className={styles.modalDeleteAccount__div}>
                <form
                  className={styles.modalDeleteAccount__div__form}
                  onSubmit={(e) => {
                    if (reasonValid) {
                      if (inputPseudo.length === 0) {
                        trigger({
                          reason: reason,
                          pseudo: inputPseudo,
                          csrfToken: csrfToken
                        });
                      }
                      e.preventDefault();
                    } else {
                      e.preventDefault();
                      if (validinputMessage === true) {
                        setMessageInputError("");
                      } else if (
                        validinputMessage === false &&
                        reasonValid === false
                      ) {
                        setReasonErrorMessage(
                          "Veuillez selectionner une raison"
                        );
                      } else {
                        setMessageInputError(
                          "Veuillez selectionner une raison"
                        );
                      }
                    }
                  }}
                >
                  <div className={styles.modalDeleteAccount__div__form__div}>
                    <label
                      className={`${
                        reason.length > 0
                          ? styles.modalDeleteAccount__div__form__div__label__value
                          : styles.modalDeleteAccount__div__form__div__label
                      }`}
                      htmlFor=""
                    >
                      Selectionnez une raison de la suppression de votre compte
                    </label>
                    <div
                      className={styles.modalDeleteAccount__div__form__div__div}
                    >
                      <select
                        className={`${
                          styles.modalDeleteAccount__div__form__div__div__select
                        }`}
                        name="reason"
                        id="reason"
                        value={reason}
                        onChange={handleChange}
                        tabIndex={0}
                      >
                        <option disabled value=""></option>
                        <option value="Vous avez atteint vos objectifs de coaching de vie et vous n'avez plus besoin des services offerts par le site">
                          Vous avez atteint vos objectifs de coaching de vie et
                          vous n&apos;avez plus besoin des services offerts par
                          le site
                        </option>
                        <option value="Vous n'êtes plus satisfait des services ou du coaching fourni par le site">
                          Vous n&apos;êtes plus satisfait des services ou du
                          coaching fourni par le site
                        </option>
                        <option value="Des problèmes techniques récurrents ou persistants sur le site">
                          Des problèmes techniques récurrents ou persistants sur
                          le site
                        </option>
                        <option value="Supprimer les données de mon compte pour protéger ma vie privée en ligne">
                          Supprimer les données de mon compte pour protéger ma
                          vie privée en ligne
                        </option>
                        <option value="autre">
                          Vous n&apos;avez pas de raison précise
                        </option>
                      </select>
                    </div>
                    <div
                      className={
                        styles.modalDeleteAccount__div__form__div__error
                      }
                    >
                      {reasonErrorMessage}
                    </div>
                  </div>

                  <input
                    type="text"
                    name="pseudo"
                    id="pseudo"
                    className={styles.modalDeleteAccount__div__form__hidden}
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={(e) => {
                      setInputPseudo(e.target.value);
                    }}
                  />
                  <p className={styles.modalDeleteAccount__p}>
                    Veuillez noter que la suppression de votre compte est
                    irréversible. Toutes vos données seront effacées et vous ne
                    pourrez plus accéder à votre compte. Si vous êtes sûr de
                    vouloir supprimer votre compte, veuillez cliquer sur le
                    bouton ci-dessous.
                  </p>
                  <div
                    className={styles.modalDeleteAccount__div__form__div__btn}
                  >
                    {isMutating && (
                      <>
                        <button
                          disabled
                          className={
                            styles.modalDeleteAccount__btn__delete__load
                          }
                        >
                          <span
                            className={
                              styles.modalDeleteAccount__btn__delete__load__span
                            }
                          >
                            Chargement
                          </span>

                          <div
                            className={
                              styles.modalDeleteAccount__btn__delete__load__arc
                            }
                          >
                            <div
                              className={
                                styles.modalDeleteAccount__btn__delete__load__arc__circle
                              }
                            ></div>
                          </div>
                        </button>
                      </>
                    )}
                    {isMutating === false && (
                      <>
                        <button
                          className={styles.modalDeleteAccount__btn__delete}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalDeleteAccount;
