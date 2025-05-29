import TabIndex from "@/app/components/tabIndex/TabIndex";
import React, { useEffect, useState } from "react";
import styles from "./ModalAddDiscoveryMeeting.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import Input from "@/app/components/input/Input";
import useGet from "@/app/components/hook/useGet";

const ModalAddDiscoveryMeeting = () => {
  
  const [emailInput, setEmailInput] = useState<string>("");
  const [firstnameInput, setFirstnameInput] = useState<string>("");
  const [lastnameInput, setLastnameInput] = useState<string>("");
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [validFirstnameInput, setValidFirstnameInput] =
    useState<boolean>(false);
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(false);
  const [firstnameInputError, setFirstnameInputError] = useState<string>("");
  const [lastnameInputError, setLastnameInputError] = useState<string>("");
  const [emailInputError, setEmailInputError] = useState<string>("");
  const [typeCoaching, setTypeCoaching] = useState<string>("");
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(false);
  const {csrfToken} = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch();
  const closeModal = () => {
    setEmailInputError("");
    setFirstnameInputError("");
    setLastnameInputError("");
    setTypeCoachingErrorMessage("");
    setValidLastnameInput(false);
    setValidEmailInput(false);
    setValidFirstnameInput(false);
    setTypeCoachingValid(false);
    setEmailInput("");
    setFirstnameInput("");
    setLastnameInput("");
    setTypeCoaching("");
    dispatch({
      type: "ModalAddDiscoveryMeetingHeader/close",
    });
  };

  const openCalendar = async () => {
    setEmailInputError("");
    setFirstnameInputError("");
    setLastnameInputError("");
    setTypeCoachingErrorMessage("");
    setValidLastnameInput(false);
    setValidEmailInput(false);
    setValidFirstnameInput(false);
    setTypeCoachingValid(false);
    setEmailInput("");
    setFirstnameInput("");
    setLastnameInput("");
    setTypeCoaching("");
    await dispatch({
      type: "ModalAddDiscoveryMeetingHeader/close",
    });
    await dispatch({
      type: "ModalCalendarDiscoveryMeetingHeader/open",
    });
  };
  const [pseudo, setPseudo] = useState<string>("");

  const {
    displayModalAddDiscoveryMeetingHeader,
    dataModalAddDiscoveryMeetingHeader,
  } = useSelector((state: RootState) => state.ModalAddDiscoveryMeetingHeader);

  const handleChange = (e: any) => {
    setTypeCoaching(e.target.value);
    if (e.target.value.length > 0) {
      setTypeCoachingValid(true);
      setTypeCoachingErrorMessage("");
    } else {
      setTypeCoachingErrorMessage("Veuillez selectionner un type de coaching");
      setTypeCoachingValid(false);
    }
  };
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/components/header/modal/discovery/api/ModalAddDiscoveryMeeting",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "firstname") {
              setFirstnameInputError(element[1]);
            }
            if (element[0] === "lastname") {
              setLastnameInputError(element[1]);
            }
            if (element[0] === "date") {
              dispatch({
                type: "flash/storeFlashMessage",
                payload: { type: "error", flashMessage: element[1] },
              });
            }
            if (element[0] === "email") {
              setEmailInputError(element[1]);
            }
            if (element[0] === "type") {
              setTypeCoachingErrorMessage(element[1]);
            }
          });
          reset();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          setEmailInputError("");
        setEmailInput('')
        setValidEmailInput(false);
          reset();
        }
      } else if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "csrfToken/store",
          payload: { csrfToken: data.csrfToken },
        });
        setEmailInputError("");
        setFirstnameInputError("");
        setLastnameInputError("");
        setTypeCoachingErrorMessage("");
        setValidLastnameInput(false);
        setValidEmailInput(false);
        setValidFirstnameInput(false);
        setTypeCoachingValid(false);
        setEmailInput('')
        setFirstnameInput("");
        setLastnameInput("");
        setTypeCoaching("");
        dispatch({
          type: "ModalRecapDiscoveryMeetingHeader/open",
          payload: {
            date: dataModalAddDiscoveryMeetingHeader,
            email: emailInput,
            type: typeCoaching,
          },
        });
        setEmailInput("");
        dispatch({
          type: "ModalAddDiscoveryMeetingHeader/close",
        });

        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        setEmailInputError("");
        setEmailInput('')
        setValidEmailInput(false);
        reset();
      }
    }
  }, [
    data,
    dataModalAddDiscoveryMeetingHeader,
    dispatch,
    emailInput,
    reset,
    typeCoaching,
  ]);

  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (
      validEmailInput === true &&
      validFirstnameInput === true &&
      validLastnameInput === true &&
      typeCoachingValid === true
    ) {
      if (pseudo.length === 0) {
        trigger({
          typeCoaching: typeCoaching,
          start: dataModalAddDiscoveryMeetingHeader,
          firstname: firstnameInput,
          lastname: lastnameInput,
          email: emailInput,
          csrfToken: csrfToken
        });
      }
    } else {
      if (validEmailInput === false) {
        if (emailInput.length === 0) {
          setEmailInputError("Email : ne peut être vide");
        }
      }
      if (validFirstnameInput === false) {
        if (firstnameInput.length === 0) {
          setFirstnameInputError("Prénom : ne peut être vide");
        }
      }
      if (validLastnameInput === false) {
        if (lastnameInput.length === 0) {
          setLastnameInputError("Nom de famille : ne peut être vide");
        }
      }
      if (typeCoachingValid === false) {
        if (typeCoaching.length === 0) {
          setTypeCoachingErrorMessage(
            "Veuillez selectionner un type de coaching"
          );
        }
      }
    }
  };
  return (
    <>
      <TabIndex displayModal={displayModalAddDiscoveryMeetingHeader} />
      <AnimatePresence>
        {displayModalAddDiscoveryMeetingHeader === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modal}
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
                className={styles.modal__return}
                onClick={() => openCalendar()}
              >
                Retour au calendrier
              </button>
              <button
                type="button"
                className={styles.modal__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modal__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modal__h1}`}>
                Rendez-vous de découverte
              </h2>
              <div className={styles.modal__rappel}>
                <p className={styles.modal__rappel__p}>
                  <Image
                    className={styles.modal__rappel__p__img}
                    src="/assets/icone/calendar-regular.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {new Date(
                    dataModalAddDiscoveryMeetingHeader
                  ).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={styles.modal__rappel__p}>
                  <Image
                    className={styles.modal__rappel__p__img}
                    src="/assets/icone/clock-solid.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {new Date(
                    dataModalAddDiscoveryMeetingHeader
                  ).toLocaleTimeString("fr-FR")}
                </p>
              </div>
              <form
                className={styles.modal__form}
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <Input
                  type={"text"}
                  value={firstnameInput}
                  id={"firstname"}
                  placeholder={"Entrez votre prénom"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInput(
                      e,
                      /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/,
                      setValidFirstnameInput,
                      setFirstnameInputError,
                      setFirstnameInput,
                      "Prénom : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
                    );
                  }}
                  validInput={validFirstnameInput}
                  errorMessage={firstnameInputError}
                  label={"Prénom"}
                  image={"user-solid"}
                  alt={"icone utilisateur"}
                  position={"first"}
                  tab={true}
                />
                <Input
                  type={"text"}
                  value={lastnameInput}
                  id={"lastname"}
                  placeholder={"Entrez votre nom de famille"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInput(
                      e,
                      /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/,
                      setValidLastnameInput,
                      setLastnameInputError,
                      setLastnameInput,
                      "Nom de famille : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
                    );
                  }}
                  validInput={validLastnameInput}
                  errorMessage={lastnameInputError}
                  label={"Nom de famille"}
                  image={"user-solid"}
                  alt={"icone utilisateur"}
                  tab={true}
                />
                <Input
                  type={"text"}
                  value={emailInput}
                  id={"email"}
                  placeholder={"Entrez votre mail"}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInput(
                      e,
                      /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                      setValidEmailInput,
                      setEmailInputError,
                      setEmailInput,
                      "Email : doit être un email valide"
                    );
                  }}
                  validInput={validEmailInput}
                  errorMessage={emailInputError}
                  label={"Email"}
                  image={"at-solid"}
                  alt={"icone email"}
                  tab={true}
                />
                <div className={styles.modal__form__div}>
                  <label
                    className={`${
                      typeCoaching.length > 0
                        ? styles.modal__form__div__label__value
                        : styles.modal__form__div__label
                    }`}
                    htmlFor=""
                  >
                    Type de coaching
                  </label>
                  <div className={styles.modal__form__div__div}>
                    <select
                      tabIndex={0}
                      className={styles.modal__form__div__div__select}
                      name="typeCoaching"
                      id="typeCoaching"
                      value={typeCoaching}
                      onChange={handleChange}
                    >
                      <option disabled value=""></option>
                      <option value="familial">Coaching familial</option>
                      <option value="couple">Coaching de couple</option>
                      <option value="professionnel">
                        Coaching professionnel
                      </option>
                    </select>
                    <Image
                      className={`${styles.modal__form__div__div__img}`}
                      src={`${`/assets/icone/handshake.png`}`}
                      alt={"icone coaching"}
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className={styles.modal__form__div__error}>
                    {typeCoachingErrorMessage}
                  </div>
                </div>

                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setPseudo(e.target.value);
                  }}
                />
                <div className={styles.modal__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={styles.modal__form__submit__btn__load}
                      >
                        <span
                          className={
                            styles.modal__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={styles.modal__form__submit__btn__load__arc}
                        >
                          <div
                            className={
                              styles.modal__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <button className={styles.modal__form__submit__btn}>
                        Ajouter le rendez-vous
                      </button>
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

export default ModalAddDiscoveryMeeting;
