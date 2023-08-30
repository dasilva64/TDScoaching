import { AppDispatch, RootState } from "../../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserLastnameData.module.scss";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import validator from "validator";
import { TextField } from "@mui/material";
import useUserGet from "@/app/components/hook/user/useUserGet";
import fetchPost from "@/app/components/fetch/user/FetchPost";

const ModalUserLastnameData = () => {
  const { userData } = useUserGet();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [lastnameInput, setLastnameInput] = useState<string>(
    userData.body.lastname
  );
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(true);
  const [errorMessageLastname, setErrorMessageLastname] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/editLastnameUser",
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
          type: "form/closeModalEditLastnameUserData",
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
        "/api/user/getUser",
        {
          ...data,
          body: {
            ...data.body,
            lastname: lastnameInput,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.body) {
      mutateMainData();
    }
  }, [data, lastnameInput]);

  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditLastnameUserData",
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
      </div>
    </>
  );
};

export default ModalUserLastnameData;
