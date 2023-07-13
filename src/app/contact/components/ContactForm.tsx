"use client";

import React, { use, useEffect, useState } from "react";
import styles from "../page.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

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

  const handlerInputFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "firstname");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "firstname");
    } else {
      handler(e, false, "Firstname : need to be not empty", "firstname");
    }
  };
  const handlerInputLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "lastname");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "lastname");
    } else {
      handler(e, false, "Lastname : need to be not empty", "lastname");
    }
  };
  const handlerInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mailregex = /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/;
    if (mailregex.test(e.target.value)) {
      handler(e, true, "", "email");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "email");
    } else {
      handler(e, false, "Email : need to be a valid email", "email");
    }
  };
  const handlerInputObject = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "object");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "object");
    } else {
      handler(e, false, "Object : need to be not empty", "object");
    }
  };
  const handlerInputMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "message");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "message");
    } else {
      handler(e, false, "Message : need to be not empty", "message");
    }
  };

  const handler = (e: any, valid: boolean, text: string, type: string) => {
    if (type === "email") {
      setInputEmail(e.target.value);
      setValidInputEmail(valid);
      setEmailInputError(text);
    } else if (type === "firstname") {
      setInputFirstname(e.target.value);
      setValidInputFirstname(valid);
      setFirstnameInputError(text);
    } else if (type === "lastname") {
      setInputLastname(e.target.value);
      setValidInputLastname(valid);
      setLastnameInputError(text);
    } else if (type === "object") {
      setInputObject(e.target.value);
      setValidInputObject(valid);
      setObjectInputError(text);
    } else if (type === "message") {
      setInputMessage(e.target.value);
      setValidInputMessage(valid);
      setMessageInputError(text);
    }
    return valid;
  };

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      validinputEmail === true &&
      validinputFirstname === true &&
      validinputLastname === true &&
      validinputMessage === true &&
      validinputObject === true
    ) {
      const fetchLogin = async () => {
        let response = await fetch("http://localhost:8080/contact/send", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: inputEmail,
            firstname: inputFirstname,
            lastname: inputLastname,
            object: inputObject,
            message: inputMessage,
            speudo: inputPseudo,
          }),
        });
        let json = await response.json();
        if (json.status === 200) {
          setInputFirstname("");
          setInputLastname("");
          setInputEmail("");
          setInputObject("");
          setInputMessage("");
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: json.message },
          });
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: json.message },
          });
        }
      };
      if (inputPseudo.length === 0) {
        fetchLogin();
      }
    } else {
      if (validinputEmail === false) {
        setEmailInputError("Email : need to be not empty");
      }
      if (validinputFirstname === false) {
        setFirstnameInputError("Firstname : need to be not empty");
      }
      if (validinputLastname === false) {
        setLastnameInputError("Lastname : need to be not empty");
      }
      if (validinputObject === false) {
        setObjectInputError("Object : need to be not empty");
      }
      if (validinputMessage === false) {
        setMessageInputError("Message comfirm : need to be not empty");
      }
    }
  };
  return (
    <>
      <form
        className={styles.contact__form}
        id="form"
        onSubmit={(e) => {
          handlerSubmit(e);
        }}
      >
        <div className={styles.contact__form__div}>
          <label className={styles.contact__form__label} htmlFor="nom">
            Nom
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            className={styles.contact__form__input}
            onChange={(e) => {
              handlerInputLastname(e);
            }}
            value={inputLastname}
          />
          <div className={styles.contact__form__input__error}>
            {lastnameInputError}
          </div>
        </div>
        <div className={styles.contact__form__div}>
          <label className={styles.contact__form__label} htmlFor="prenom">
            Prenom
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            className={styles.contact__form__input}
            onChange={(e) => {
              handlerInputFirstname(e);
            }}
            value={inputFirstname}
          />
          <div className={styles.contact__form__input__error}>
            {firstnameInputError}
          </div>
        </div>
        <div className={styles.contact__form__div}>
          <label className={styles.contact__form__label} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.contact__form__input}
            onChange={(e) => {
              handlerInputEmail(e);
            }}
            value={inputEmail}
          />
          <div className={styles.contact__form__input__error}>
            {emailInputError}
          </div>
        </div>
        <div className={styles.contact__form__div}>
          <label className={styles.contact__form__label} htmlFor="objet">
            Objet
          </label>
          <input
            type="text"
            id="objet"
            name="objet"
            className={styles.contact__form__input}
            onChange={(e) => {
              handlerInputObject(e);
            }}
            value={inputObject}
          />
          <div className={styles.contact__form__input__error}>
            {objectInputError}
          </div>
        </div>
        <div className={styles.contact__form__div}>
          <label className={styles.contact__form__label} htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.contact__form__input}
            onChange={(e) => {
              handlerInputMessage(e);
            }}
            value={inputMessage}
          ></textarea>
          <div className={styles.contact__form__input__error}>
            {messageInputError}
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
            setInputPseudo(e.target.value);
          }}
        />
        <div>
          <input
            className={styles.contact__form__submit}
            type="submit"
            value="C'est parti"
          />
          <div className={styles.contact__form__input__error}></div>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
