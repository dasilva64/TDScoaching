"use client";

import React, { useEffect, useState } from "react";
import styles from "../page.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import fetchPost from "../../components/fetch/FetchPost";
import stylesForm from "./ContactForm.module.scss";
import Input from "@/app/components/input/Input";
import useGet from "@/app/components/hook/useGet";

const ContactForm = () => {
  const [inputFirstname, setInputFirstname] = useState<string>("");
  const [inputLastname, setInputLastname] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputObject, setInputObject] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const [validinputFirstname, setValidInputFirstname] =
    useState<boolean>(false);
  const [validinputLastname, setValidInputLastname] = useState<boolean>(false);
  const [validinputEmail, setValidInputEmail] = useState<boolean>(false);
  const [validinputObject, setValidInputObject] = useState<boolean>(false);
  const [validinputMessage, setValidInputMessage] = useState<boolean>(false);

  const [firstnameInputError, setFirstnameInputError] = useState<string>("");
  const [lastnameInputError, setLastnameInputError] = useState<string>("");
  const [emailInputError, setEmailInputError] = useState<string>("");
  const [objectInputError, setObjectInputError] = useState<string>("");
  const [messageInputError, setMessageInputError] = useState<string>("");
  const { data: dataContact } = useGet("/contact/components/api");
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/contact/components/api",
    fetchPost
  );

  useEffect(() => {
    const clearState = () => {
      setInputFirstname("");
      setInputLastname("");
      setInputEmail("");
      setInputObject("");
      setInputMessage("");
      setInputPseudo("");
      setValidInputFirstname(false);
      setValidInputLastname(false);
      setValidInputEmail(false);
      setValidInputObject(false);
      setValidInputMessage(false);
      setFirstnameInputError("");
      setLastnameInputError("");
      setEmailInputError("");
      setObjectInputError("");
      setMessageInputError("");
    };
    if (data) {
      if (data.status === 200) {
        clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        reset();
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "firstname") {
              setValidInputFirstname(false);
              setFirstnameInputError(element[1]);
            }
            if (element[0] === "lastname") {
              setValidInputLastname(false);
              setLastnameInputError(element[1]);
            }
            if (element[0] === "email") {
              setValidInputEmail(false);
              setEmailInputError(element[1]);
            }
            if (element[0] === "object") {
              setValidInputObject(false);
              setObjectInputError(element[1]);
            }
            if (element[0] === "message") {
              setValidInputMessage(false);
              setMessageInputError(element[1]);
            }
          });
          reset();
        } else {
          clearState();
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }
      }else {
        clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, reset]);

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      validinputEmail === true &&
      validinputFirstname === true &&
      validinputLastname === true &&
      validinputMessage === true &&
      validinputObject === true
    ) {
      if (inputPseudo.length === 0) {
        const fetchContact = async () => {
            trigger({
            email: validator.escape(inputEmail.trim()),
            firstname: validator.escape(inputFirstname.trim()),
            lastname: validator.escape(inputLastname.trim()),
            object: validator.escape(inputObject.trim()),
            message: validator.escape(inputMessage.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
            csrfToken: dataContact.csrfToken
          });
          
          
        };
        if (inputPseudo.length === 0) {
          fetchContact();
        }
      }
    } else {
      if (validinputEmail === false) {
        if (inputEmail.length === 0) {
          setEmailInputError("Email : ne peut pas être vide");
        }
      }
      if (validinputFirstname === false) {
        if (inputFirstname.length === 0) {
          setFirstnameInputError("Prénom : ne peut pas être vide");
        }
      }
      if (validinputLastname === false) {
        if (inputLastname.length === 0) {
          setLastnameInputError("Nom de famille : ne peut pas être vide");
        }
      }
      if (validinputObject === false) {
        if (inputObject.length === 0) {
          setObjectInputError("Objet : ne peut pas être vide");
        }
      }
      if (validinputMessage === false) {
        if (inputMessage.length === 0) {
          setMessageInputError("Message : ne peut pas être vide");
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
    let removeDoubleSpace = e.target.value.replace(/\s\s+/g, " ");
    setInput(removeDoubleSpace);
    if (regex.test(removeDoubleSpace)) {
      setValidInput(true);
      setErrorMessage("");
    } else if (removeDoubleSpace.length === 0) {
      setValidInput(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setErrorMessage(errorMessage);
    }
  };
  return (
    <>
      <form
        className={styles.contact__main__container__form}
        id="form"
        onSubmit={(e) => {
          handlerSubmit(e);
        }}
      >
        <Input
          label={"Nom de famille"}
          value={inputLastname}
          id={"lastname"}
          type={"text"}
          placeholder={"Entrez votre nom de famille"}
          regex={/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ ]{3,40}$/}
          onchange={(e: any) => {
            handlerInput(
              e,
              "lastname",
              /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ ]{3,40}$/,
              setValidInputLastname,
              setLastnameInputError,
              setInputLastname,
              "Nom de famille : 3 lettres minimum"
            );
          }}
          validInput={validinputLastname}
          errorMessage={lastnameInputError}
          tab={false}
        />
        <Input
          label={"Prénom"}
          value={inputFirstname}
          id={"firstname"}
          type={"text"}
          placeholder={"Entrez votre prénom"}
          regex={/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ ]{3,40}$/}
          onchange={(e: any) => {
            handlerInput(
              e,
              "firstname",
              /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ ]{3,40}$/,
              setValidInputFirstname,
              setFirstnameInputError,
              setInputFirstname,
              "Prénom : 3 lettres minimum"
            );
          }}
          validInput={validinputFirstname}
          errorMessage={firstnameInputError}
          tab={false}
        />

        <Input
          label={"Email"}
          value={inputEmail}
          id={"email"}
          type={"email"}
          placeholder={"Entrez votre mail"}
          regex={/^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/}
          onchange={(e: any) => {
            handlerInput(
              e,
              "email",
              /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
              setValidInputEmail,
              setEmailInputError,
              setInputEmail,
              "Email : doit avoir un format valide et contenir entre 5 et 50 caractères"
            );
          }}
          validInput={validinputEmail}
          errorMessage={emailInputError}
          tab={false}
        />

        <Input
          label={"Objet"}
          value={inputObject}
          id={"object"}
          type={"text"}
          placeholder={"Entrez l'objet de votre message"}
          regex={/^[A-Za-z0-9À-ÿ][A-Za-z0-9À-ÿ,()?!;:"'#@_. -]{1,50}$/}
          onchange={(e: any) => {
            handlerInput(
              e,
              "object",
              /^[A-Za-z0-9À-ÿ][A-Za-z0-9À-ÿ,()?!;:"'#@_. -]{1,50}$/,
              setValidInputObject,
              setObjectInputError,
              setInputObject,
              "Objet : doit contenir entre 2 et 50 caractères (lettres, chiffres, ponctuation) et ne peut pas commencer par une ponctuation"
            );
          }}
          validInput={validinputObject}
          errorMessage={objectInputError}
          tab={false}
        />
        <div className={stylesForm.area}>
          <label className={stylesForm.area__label} htmlFor="message">
            Message
          </label>
          <textarea
            rows={2}
            value={inputMessage}
            className={`${stylesForm.area__textarea} modalOpen`}
            id="message"
            onChange={(e) => {
              handlerInput(
                e,
                "message",
                /^[A-Za-z0-9À-ÿ][A-Za-z0-9À-ÿ,()?!;:"'#@_. -]{1,}$/,
                setValidInputMessage,
                setMessageInputError,
                setInputMessage,
                "Message : doit contenir au moins 2 caractères (lettres, chiffres, ponctuation) et ne peut pas commencer par une ponctuation"
              );
            }}
            placeholder="Entrez votre message"
          ></textarea>
          {validinputMessage === false && (
            <div className={stylesForm.area__error}>{messageInputError}</div>
          )}
        </div>

        <label htmlFor="pseudo" style={{ display: "none" }}>
          Pseudo
        </label>
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
        <div>
          {isMutating && (
            <>
              <button
                disabled
                className={styles.contact__main__container__form__submit__load}
              >
                <span
                  className={
                    styles.contact__main__container__form__submit__load__span
                  }
                >
                  Chargement
                </span>

                <div
                  className={
                    styles.contact__main__container__form__submit__load__arc
                  }
                >
                  <div
                    className={
                      styles.contact__main__container__form__submit__load__arc__circle
                    }
                  ></div>
                </div>
              </button>
            </>
          )}
          {isMutating === false && (
            <>
              <input
                className={`${styles.contact__main__container__form__submit} modalOpen`}
                type="submit"
                value="Envoyer"
              />
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default ContactForm;
