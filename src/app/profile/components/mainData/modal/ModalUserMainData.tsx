import { AppDispatch, RootState } from "../../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserMainData.module.scss";
import GroupForm from "../../../../components/form/group";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetchEditMainData from "../../../../components/hook/user/useEditMainData";
import { TextField } from "@mui/material";
import useUserGet from "@/app/components/hook/useUserGet";

const ModalUserMainData = () => {

  const {userData} = useUserGet()
  console.log(userData)
  const dispatch = useDispatch<AppDispatch>();
  const [firstnameInput, setFirstnameInput] = useState<string>(userData.body.firstname);
  const [lastnameInput, setLastnameInput] = useState<string>(userData.body.lastname);
  const [validFirstnameInput, setValidFirstnameInput] =
    useState<boolean>(false);
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(false);
  const [errorMessageFirstname, setErrorMessageFirstname] =
    useState<string>("");
  const [errorMessageLastname, setErrorMessageLastname] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/editMainData",
    fetchEditMainData
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalEditMainUserData",
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
            lastname: lastnameInput,
          },
        },
        { revalidate: false }
      );
    };
    if (data) {
      mutateMainData();
    }
  });

  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditMainUserData",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validFirstnameInput === true || validLastnameInput === true) {
      const fetchLogin = async () => {
        trigger({ firstname: firstnameInput, lastname: lastnameInput });
      };
      fetchLogin();
    } else {
      if (userData.body.firstname === firstnameInput) {
        setErrorMessageFirstname("Prénom : ne doit pas égal à l'ancien prénom");
      }
      if (userData.body.firstname !== firstnameInput && validFirstnameInput === false) {
        setErrorMessageFirstname("Prénom : ne doit pas être vide");
      }
      if (userData.body.lastname === lastnameInput) {
        setErrorMessageLastname("Nom de famille : ne doit pas égal à l'ancien nom de famille");
      }
      if (userData.body.lastname !== lastnameInput && validLastnameInput === false) {
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
    setInput(e.target.value);
    if (regex.test(e.target.value)) {
      setValidInput(true);
      setErrorMessage("");
    } else if (e.target.value.length === 0) {
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
          Modification des informations principales
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
                /^[A-Za-z]{3,}$/,
                setValidFirstnameInput,
                setErrorMessageFirstname,
                setFirstnameInput,
                "Prénom : 3 lettres minimum"
              );
            }}
            helperText={errorMessageFirstname}
          />
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
                /^[A-Za-z]{3,}$/,
                setValidLastnameInput,
                setErrorMessageLastname,
                setLastnameInput,
                "Nom de famille : 3 lettres minimum"
              );
            }}
            helperText={errorMessageLastname}
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

export default ModalUserMainData;
