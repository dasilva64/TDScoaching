import { RootState } from "@/app/redux/store";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "./PhoneData.module.scss";
import fetchUserEditPhoneData from "@/app/components/fetch/user/fetchUserEditPhoneData";
import { mutate } from "swr";
import fetchReSendPhoneCode from "@/app/components/fetch/user/useReSendPhone";

const PhoneCheck = () => {
  const dispatch = useDispatch();
  const { displayModalEditPhoneData } = useSelector(
    (state: RootState) => state.form
  );
  const [codeInput, setCodeInput] = useState<string>("");
  const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
  const [errorMessageCode, setErrorMessageCode] = useState<string>("");
  const { trigger, data } = useSWRMutation(
    "/api/user/editPhoneUser",
    fetchUserEditPhoneData
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalEditPhoneData",
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
      let copyNewPhone = data.body.phone;
      mutate(
        "/api/user/getUser",
        {
          ...data,
          body: {
            ...data.body,
            phone: copyNewPhone,
            editPhone: null,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.status === 200) {
      mutateMainData();
    }
  }, [data]);
  const { trigger: triggerReSendCode, data: dataReSendCode } = useSWRMutation(
    "/api/user/phoneReSendCode",
    fetchReSendPhoneCode
  );
  useEffect(() => {
    if (dataReSendCode) {
      if (dataReSendCode.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataReSendCode.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataReSendCode.message },
        });
      }
    }
  }, [dataReSendCode, dispatch]);
  useEffect(() => {
    const mutateMaindataReSendCode = async () => {
      let copyNewPhone = dataReSendCode.body.editPhone;
      mutate(
        "/api/user/getUser",
        {
          ...dataReSendCode,
          body: {
            ...dataReSendCode.body,
            editPhone: copyNewPhone,
          },
        },
        { revalidate: false }
      );
    };
    if (dataReSendCode && dataReSendCode.status === 200) {
      mutateMaindataReSendCode();
    }
  }, [dataReSendCode]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(validCodeInput);
    if (validCodeInput === true) {
      const fetchLogin = async () => {
        trigger({ code: codeInput });
      };
      fetchLogin();
    } else {
      if (validCodeInput === false) {
        setErrorMessageCode("Code : doit contenir 8 chiffres");
      }
    }
  };
  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditPhoneData",
    });
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
      {displayModalEditPhoneData === true && (
        <div className={styles.modalEditEmailSendData}>
          <button
            className={styles.modalEditEmailSendData__btn}
            onClick={() => {
              closeForm();
            }}
          >
            <span className={styles.modalEditEmailSendData__btn__cross}>
              &times;
            </span>
          </button>
          <h1 className={styles.modalEditEmailSendData__h1}>
            Validation de votre numéro de téléphone
          </h1>
          <form
            className={styles.modalEditEmailSendData__form}
            action=""
            onSubmit={(e) => {
              handlerSubmit(e);
            }}
          >
            <TextField
              value={codeInput}
              style={{ margin: "20px 0px 30px 0px" }}
              id={"code"}
              label={"Code de validation"}
              variant="standard"
              type={"number"}
              placeholder={"Entrez votre code"}
              FormHelperTextProps={{ style: { color: "red" } }}
              onChange={(e) => {
                handlerInput(
                  e,
                  "firstname",
                  /^[0-9]{8,8}$/,
                  setValidCodeInput,
                  setErrorMessageCode,
                  setCodeInput,
                  "Code : doit contenir 8 chiffres"
                );
              }}
              helperText={errorMessageCode}
            />
            <div className={styles.modalEditEmailSendData__form__submit}>
              <input
                className={styles.modalEditEmailSendData__form__submit__btn}
                type="submit"
                value="Valider votre numéro de téléphone"
              />
            </div>
          </form>
          <div className={styles.modalEditEmailSendData__reSend}>
            <button
              className={styles.modalEditEmailSendData__reSend__btn}
              onClick={() => {
                triggerReSendCode();
              }}
            >
              Renvoyer un code
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PhoneCheck;
