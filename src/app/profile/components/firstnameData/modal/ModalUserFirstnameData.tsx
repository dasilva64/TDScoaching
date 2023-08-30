import { AppDispatch, RootState } from "../../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserFirstnameData.module.scss";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import validator from "validator";
import { TextField } from "@mui/material";
import useUserGet from "@/app/components/hook/user/useUserGet";
import fetchPost from "@/app/components/fetch/user/FetchPost";

const ModalUserFirstnameData = () => {
  const { userData } = useUserGet();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [firstnameInput, setFirstnameInput] = useState<string>(
    userData.body.firstname
  );
  const [validFirstnameInput, setValidFirstnameInput] = useState<boolean>(true);
  const [errorMessageFirstname, setErrorMessageFirstname] =
    useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/editFirstnameUser",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalEditFirstnameUserData",
        });
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
        "/api/user/getUser",
        {
          ...data,
          body: {
            ...data.body,
            firstname: firstnameInput,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.body) {
      mutateMainData();
    }
  }, [data, firstnameInput]);

  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditFirstnameUserData",
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
      <div className={styles.modalEditMainUserData}>
        <button
          className={styles.modalEditMainUserData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditMainUserData__btn__cross}>
            &times;
          </span>
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
      </div>
    </>
  );
};

export default ModalUserFirstnameData;
