import fetchPost from "@/app/components/fetch/user/FetchPost";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { AppDispatch } from "@/app/redux/store";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import styles from "./ModalUserGenderData.module.scss";
import { FormControl } from "@mui/base";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";

const ModalUserGenderData = () => {
  const { userData } = useUserGet();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [genderInput, setGenderInput] = useState<string>(userData.body.genre);
  const [validGenderInput, setValidGenderInput] = useState<boolean>(true);
  const [genderInputError, setGenderInputError] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "/api/user/editGenderUser",
    fetchPost
  );
  console.log(data);
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalEditGenderUserData",
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "genre") {
            setGenderInputError(element[1]);
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
            genre: data.body.genre,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.body) {
      mutateMainData();
    }
  }, [data]);

  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditGenderUserData",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validGenderInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          console.log("fetchLogin");
          trigger({
            genre: validator.escape(genderInput.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });
        };
        fetchLogin();
      }
    } else {
      if (userData.body.birth !== genderInput && validGenderInput === false) {
        setGenderInputError("Prénom : ne doit pas être vide");
      }
    }
  };
  return (
    <>
      <div className={styles.modalEditGenderUserData}>
        <button
          className={styles.modalEditGenderUserData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditGenderUserData__btn__cross}>
            &times;
          </span>
        </button>
        <h1 className={styles.modalEditGenderUserData__h1}>
          Modifier votre genre
        </h1>
        <form
          className={styles.modalEditGenderUserData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <FormControl style={{ marginTop: "15px" }}>
            <FormLabel id="demo-row-radio-buttons-group-label">Sexe</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => {
                setGenderInput(e.target.value);
                setValidGenderInput(true);
                setGenderInputError("");
              }}
              defaultValue={userData.body.genre}
            >
              <FormControlLabel
                value="femme"
                control={<Radio />}
                label="Femme"
              />
              <FormControlLabel
                value="homme"
                control={<Radio />}
                label="Homme"
              />
            </RadioGroup>
            <FormHelperText style={{ color: "red", margin: "0px" }}>
              {genderInputError}
            </FormHelperText>
          </FormControl>
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
          <div className={styles.modalEditGenderUserData__form__submit}>
            <input
              className={styles.modalEditGenderUserData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserGenderData;
