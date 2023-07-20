import React, { useEffect, useState } from "react";
import styles from "./ModalPhoneSendTokenData.module.scss";
import { AppDispatch } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { mutate } from "swr";
import fetchUserEditPhoneSendTokenData from "@/app/components/fetch/user/fetchUserEditPhoneSendTokenData";

const ModalUserPhoneData = () => {
  const { userData } = useUserGet();
  const dispatch = useDispatch<AppDispatch>();
  const [phoneInput, setPhoneInput] = useState<string>(userData?.body.phone);
  const [validPhoneInput, setValidPhoneInput] = useState<boolean>(false);
  const [errorMessagePhone, setErrorMessagePhone] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/sendTokenEditPhone",
    fetchUserEditPhoneSendTokenData
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        console.log(data);
        const mutateUser = async () => {
          let test = {
            newPhone: data.body.editPhone.newPhone,
            limitDate: data.body.editPhone.limitDate,
          };
          mutate(
            "/api/user/getUser",
            {
              ...data,
              body: {
                ...data.body,
                editPhone: test,
              },
            },
            { revalidate: false }
          );
        };
        mutateUser();
        dispatch({
          type: "form/openModalEditPhoneData",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
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
      const fetchLogin = async () => {
        trigger({
          phone: phoneInput,
        });
      };
      fetchLogin();
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
                /^[0-9]{10,10}$/,
                setValidPhoneInput,
                setErrorMessagePhone,
                setPhoneInput,
                "Numéro de téléphone : 10 chiffres"
              );
            }}
            helperText={errorMessagePhone}
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
