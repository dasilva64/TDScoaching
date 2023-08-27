import React, { useEffect, useState } from "react";
import styles from "./ModalPhoneSendTokenData.module.scss";
import { AppDispatch } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { mutate } from "swr";
import validator from "validator";
import fetchPost from "@/app/components/fetch/user/FetchPost";

const ModalUserPhoneData = () => {
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const { userData } = useUserGet();
  const dispatch = useDispatch<AppDispatch>();
  const [phoneInput, setPhoneInput] = useState<string>(userData?.body.phone);
  const [validPhoneInput, setValidPhoneInput] = useState<boolean>(false);
  const [errorMessagePhone, setErrorMessagePhone] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/sendTokenEditPhone",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        const mutateUser = async () => {
          let editTokenPhoneObject = {
            newPhone: data.body.editPhone.newPhone,
            limitDate: data.body.editPhone.limitDate,
          };
          mutate(
            "/api/user/getUser",
            {
              ...data,
              body: {
                ...data.body,
                editPhone: editTokenPhoneObject,
              },
            },
            { revalidate: false }
          );
        };
        if (data && data.body) {
          mutateUser();
        }
        dispatch({
          type: "form/openModalEditPhoneData",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "phone") {
            setErrorMessagePhone(element[1]);
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

  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditPhoneSendData",
    });
  };
  useEffect(() => {
    if (phoneInput && phoneInput.length > 0) {
      setValidPhoneInput(true);
    }
  }, [phoneInput]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validPhoneInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({
            phone: validator.escape(phoneInput.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchLogin();
      }
    } else {
      if (validPhoneInput === false) {
        setErrorMessagePhone("Mot de passe : ne doit pas être vide");
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
  return (
    <>
      <div className={styles.modalEditPhoneData}>
        <button
          className={styles.modalEditPhoneData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditPhoneData__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalEditPhoneData__h1}>
          Modification du numéro de téléphone
        </h1>
        <form
          className={styles.modalEditPhoneData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <TextField
            value={phoneInput}
            style={{ margin: "20px 0px" }}
            id={"phone"}
            label={"Numéro de téléphone"}
            variant="standard"
            type={"number"}
            placeholder={"Entrez votre numéro de téléphone"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              handlerInput(
                e,
                "firstname",
                /^[0](6|7)[0-9]{8,8}$/,
                setValidPhoneInput,
                setErrorMessagePhone,
                setPhoneInput,
                "Numéro de téléphone : doit être une numéro de téléphone valide commençant par 06 or 07"
              );
            }}
            helperText={errorMessagePhone}
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
          <div className={styles.modalEditPhoneData__form__submit}>
            <input
              className={styles.modalEditPhoneData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserPhoneData;
