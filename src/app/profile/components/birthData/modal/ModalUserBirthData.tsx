import fetchPost from "@/app/components/fetch/user/FetchPost";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { AppDispatch } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { frFR } from "@mui/x-date-pickers/locales";
import "dayjs/locale/fr";
import styles from "./ModalUserBirthData.module.scss";

const frenchLocale =
  frFR.components.MuiLocalizationProvider.defaultProps.localeText;

const ModalUserBirthData = () => {
  const { userData } = useUserGet();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [birthInput, setBirthInput] = useState<string>(userData.body.birth);
  const [validBirthInput, setValidBirthInput] = useState<boolean>(true);
  const [errorMessageBirth, setErrorMessageBirth] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/editBirthUser",
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
          type: "form/closeModalEditBirthUserData",
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "birth") {
            setErrorMessageBirth(element[1]);
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
            birth: data.body.birth,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.body) {
      mutateMainData();
    }
  }, [data, birthInput]);

  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditBirthUserData",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validBirthInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({
            birth: dayjs(birthInput).format("YYYY-MM-DD"),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchLogin();
      }
    } else {
      if (userData.body.birth !== birthInput && validBirthInput === false) {
        setErrorMessageBirth("Prénom : ne doit pas être vide");
      }
    }
  };
  const handlerInputBirth = (e: any) => {
    let currentDate = new Date();
    let limiteDate = currentDate.setFullYear(currentDate.getFullYear() - 18);
    if (!e) {
      setValidBirthInput(false);
      setErrorMessageBirth(
        "Date de naissance : doit avoir le format jj/mm/aaaa"
      );
    } else {
      setBirthInput(e.$d);
      let choiceDate = new Date(e.$d);
      if (choiceDate instanceof Date === false || isNaN(e.$d)) {
        setValidBirthInput(false);
        setErrorMessageBirth(
          "Date de naissance : doit avoir le format jj/mm/aaaa"
        );
      } else if (choiceDate.getTime() > new Date(limiteDate).getTime()) {
        setValidBirthInput(false);
        setErrorMessageBirth("Date de naissance : vous devez être majeur");
      } else {
        setBirthInput(e.$d);
        setValidBirthInput(true);
        setErrorMessageBirth("");
      }
    }
  };
  return (
    <>
      <div className={styles.modalEditBirthUserData}>
        <button
          className={styles.modalEditBirthUserData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditBirthUserData__btn__cross}>
            &times;
          </span>
        </button>
        <h1 className={styles.modalEditBirthUserData__h1}>
          Modifier votre date de naissance
        </h1>
        <form
          className={styles.modalEditBirthUserData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="fr"
            localeText={frenchLocale}
          >
            <DatePicker
              slotProps={{
                textField: {
                  variant: "standard",
                  helperText: errorMessageBirth,
                  style: { color: "red" },
                },
              }}
              label="Date de naissance"
              onChange={(e: any) => {
                handlerInputBirth(e);
              }}
            />
          </LocalizationProvider>
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
          <div className={styles.modalEditBirthUserData__form__submit}>
            <input
              className={styles.modalEditBirthUserData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserBirthData;
