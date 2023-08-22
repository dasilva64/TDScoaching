"use client";

import React, { use, useEffect, useState } from "react";
import styles from "../page.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { FormHelperText, FormLabel, TextField } from "@mui/material";
import useSWRMutation from "swr/mutation";
import fetchSendEmail from "@/app/components/fetch/contact/useContact";
import Textarea from "@mui/joy/Textarea";
import validator from "validator";

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

  const { trigger, data } = useSWRMutation("/api/contact/send", fetchSendEmail);

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        setInputFirstname("");
        setInputLastname("");
        setInputEmail("");
        setInputObject("");
        setInputMessage("");
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "firstname") {
            setFirstnameInputError(element[1]);
          }
          if (element[0] === "lastname") {
            setLastnameInputError(element[1]);
          }
          if (element[0] === "email") {
            setEmailInputError(element[1]);
          }
          if (element[0] === "object") {
            setObjectInputError(element[1]);
          }
          if (element[0] === "message") {
            setMessageInputError(element[1]);
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
        trigger({
          email: validator.escape(inputEmail),
          firstname: validator.escape(inputFirstname),
          lastname: validator.escape(inputLastname),
          object: validator.escape(inputObject),
          message: validator.escape(inputMessage),
          pseudo: validator.escape(inputPseudo),
        });
      };
      if (inputPseudo.length === 0) {
        fetchLogin();
      }
    } else {
      if (validinputEmail === false) {
        setEmailInputError("Email : ne peut pas être vide");
      }
      if (validinputFirstname === false) {
        setFirstnameInputError("Prénom : ne peut pas être vide");
      }
      if (validinputLastname === false) {
        setLastnameInputError("Nom de famille : ne peut pas être vide");
      }
      if (validinputObject === false) {
        setObjectInputError("Objet : ne peut pas être vide");
      }
      if (validinputMessage === false) {
        setMessageInputError("Message : ne peut pas être vide");
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
        className={styles.contact__form}
        id="form"
        onSubmit={(e) => {
          handlerSubmit(e);
        }}
      >
        <TextField
          value={inputLastname}
          id={"lastname"}
          style={{ margin: "10px 0px" }}
          label={"Nom de famille"}
          variant="standard"
          type={"text"}
          placeholder={"Entrez votre nom de famille"}
          FormHelperTextProps={{ style: { color: "red" } }}
          onChange={(e) => {
            handlerInput(
              e,
              "lastname",
              /^[A-Za-z ]{3,}$/,
              setValidInputLastname,
              setLastnameInputError,
              setInputLastname,
              "Nom de famille : 3 lettres minimum"
            );
          }}
          helperText={lastnameInputError}
        />
        <TextField
          value={inputFirstname}
          id={"firstname"}
          style={{ margin: "10px 0px" }}
          label={"Prénom"}
          variant="standard"
          type={"text"}
          placeholder={"Entrez votre prénom"}
          FormHelperTextProps={{ style: { color: "red" } }}
          onChange={(e) => {
            handlerInput(
              e,
              "firstname",
              /^[A-Za-z ]{3,}$/,
              setValidInputFirstname,
              setFirstnameInputError,
              setInputFirstname,
              "Prénom : 3 lettres minimum"
            );
          }}
          helperText={firstnameInputError}
        />
        <TextField
          value={inputEmail}
          id={"email"}
          style={{ margin: "10px 0px" }}
          label={"Email"}
          variant="standard"
          type={"email"}
          placeholder={"Entrez votre mail"}
          FormHelperTextProps={{ style: { color: "red" } }}
          onChange={(e) => {
            handlerInput(
              e,
              "email",
              /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
              setValidInputEmail,
              setEmailInputError,
              setInputEmail,
              "Email : doit avoir un format valide"
            );
          }}
          helperText={emailInputError}
        />
        <TextField
          value={inputObject}
          id={"object"}
          style={{ margin: "10px 0px" }}
          label={"Objet"}
          variant="standard"
          type={"text"}
          placeholder={"Entrez l'objet de votre message"}
          FormHelperTextProps={{ style: { color: "red" } }}
          onChange={(e) => {
            handlerInput(
              e,
              "object",
              /^[A-Za-z0-9][A-Za-z0-9,?;.:!() ]{1,}$/,
              setValidInputObject,
              setObjectInputError,
              setInputObject,
              "Objet : doit contenir au moins 2 caractères (lettres, chiffres, ponctuation)"
            );
          }}
          helperText={objectInputError}
        />
        <FormLabel>Message</FormLabel>
        <Textarea
          value={inputMessage}
          onChange={(e) => {
            handlerInput(
              e,
              "message",
              /^[A-Za-z0-9][A-Za-z0-9,?;.:!() ]{1,}$/,
              setValidInputMessage,
              setMessageInputError,
              setInputMessage,
              "Message : doit contenir au moins 2 caractères (lettres, chiffres, ponctuation)"
            );
          }}
          placeholder="Entrez votre message"
          minRows={2}
        />
        <FormHelperText>{messageInputError}</FormHelperText>

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
            value="Envoyer"
          />
          <div className={styles.contact__form__input__error}></div>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
