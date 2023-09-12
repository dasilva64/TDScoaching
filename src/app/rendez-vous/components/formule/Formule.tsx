import fetchPost from "@/app/components/fetch/FetchPost";
import { FormControl } from "@mui/base";
import styles from "./Formule.module.scss";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";

const Formule = () => {
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [inputFormule, setInputFormule] = useState<string>("");
  const [validFormuleInput, setValidFormuleInput] = useState<boolean>(false);
  const [errorMessageFormule, setErrorMessageFormule] = useState<string>("");
  const { trigger, data, reset } = useSWRMutation(
    "/api/user/editFormuleUser",
    fetchPost
  );
  const dispatch = useDispatch();
  const clearState = () => {
    setInputFormule("");
    setInputPseudo("");
    setValidFormuleInput(false);
    setErrorMessageFormule("");
  };
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate(
          "/api/user/getUserMeeting",
          {
            ...data,
            body: {
              ...data.body,
            },
          },
          { revalidate: false }
        );
        reset();
        clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "formule") {
            setErrorMessageFormule(element[1]);
          }
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch, inputFormule, reset]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validFormuleInput === true) {
      if (inputPseudo.length === 0) {
        const fetchEdit = async () => {
          trigger({
            pseudo: inputPseudo,
            formule: inputFormule,
          });
        };
        fetchEdit();
      }
    } else {
      setErrorMessageFormule("Veuillez choisir une formule");
    }
  };
  return (
    <div style={{ width: "100%" }} className={styles.formule}>
      <h3 className={styles.formule__h3}>
        Choisir une formule pour pouvoir prendre un rendez-vous
      </h3>
      <div className={styles.formule__content}>
        <div className={styles.formule__content__card}>
          <h2 className={styles.formule__content__card__h2}>Formule Unique</h2>
          <p className={styles.formule__content__card__p}>
            1 rendez-vous de coaching
          </p>
        </div>
        <div className={styles.formule__content__card}>
          <h2 className={styles.formule__content__card__h2}>Formule Flash</h2>
          <p className={styles.formule__content__card__p}>
            3 rendez-vous de coaching
          </p>
        </div>
        <div className={styles.formule__content__card}>
          <h2 className={styles.formule__content__card__h2}>Formule Longue</h2>
          <p className={styles.formule__content__card__p}>
            10 rendez-vous de coaching
          </p>
        </div>
      </div>
      <Link className={styles.formule__link} href={"/tarif"}>
        En savoir plus sur les formules
      </Link>
      <form
        className={styles.formule__form}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Formule</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={(e) => {
              setInputFormule(e.target.value);
              setValidFormuleInput(true);
              setErrorMessageFormule("");
            }}
          >
            <FormControlLabel
              value="unique"
              control={<Radio />}
              label="Formule Unique"
            />
            <FormControlLabel
              value="flash"
              control={<Radio />}
              label="Formule Flash"
            />
            <FormControlLabel
              value="longue"
              control={<Radio />}
              label="Formule Longue"
            />
          </RadioGroup>
          <FormHelperText style={{ color: "red", margin: "0px" }}>
            {errorMessageFormule}
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
        <input
          className={styles.formule__form__input}
          type="submit"
          value="Envoyer"
        />
      </form>
    </div>
  );
};

export default Formule;
