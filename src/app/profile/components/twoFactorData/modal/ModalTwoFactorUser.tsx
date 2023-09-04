import { AppDispatch } from "../../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./ModalTwoFactorUser.module.scss";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { TextField } from "@mui/material";
import fetchPost from "@/app/components/fetch/FetchPost";

const ModalTwoFactor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [codeInput, setCodeInput] = useState<string>("");
  const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
  const [errorMessageCode, setErrorMessageCode] = useState<string>("");
  const { trigger, data } = useSWRMutation(
    "/api/user/editTwoFactor",
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
          type: "form/closeModalTwoFactor",
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
        "/api/user/getUserProfile",
        {
          ...data,
          body: {
            ...data.body,
            twoFactor: true,
            twoFactorCode: null,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.status === 200) {
      mutateMainData();
    }
  });

  /* const { trigger: triggerReSendCode, data: dataReSendCode } = useSWRMutation(
    "http://localhost:8080/user/reSendCode",
    fetchReSendEmailCode
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
      let copyNewEmail = dataReSendCode.body.editEmail;
      mutate(
        "/api/user/getUserProfile",
        {
          ...dataReSendCode,
          body: {
            ...dataReSendCode.body,
            editEmail: copyNewEmail,
          },
        },
        { revalidate: false }
      );
    };
    if (dataReSendCode && dataReSendCode.status === 200) {
      mutateMaindataReSendCode();
    }
  }, [dataReSendCode]); */
  const closeForm = () => {
    dispatch({
      type: "form/closeModalTwoFactor",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className={styles.modalTwoFactorUser}>
        <button
          className={styles.modalTwoFactorUser__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalTwoFactorUser__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalTwoFactorUser__h1}>
          Valider l&apos;authentification à deux facteurs
        </h1>
        <form
          className={styles.modalTwoFactorUser__form}
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
          <div className={styles.modalTwoFactorUser__form__submit}>
            <input
              className={styles.modalTwoFactorUser__form__submit__btn}
              type="submit"
              value="Valider"
            />
          </div>
        </form>
        {/* <div className={styles.modalTwoFactorUser__reSend}>
            <button
              className={styles.modalTwoFactorUser__reSend__btn}
              onClick={() => {
                triggerReSendCode();
              }}
            >
              Renvoyer un code
            </button>
          </div> */}
      </div>
    </>
  );
};

export default ModalTwoFactor;
