import React, { useEffect, useState } from "react";
import styles from "./ModalEditFormuleUser.module.scss";
import { useDispatch } from "react-redux";
import { FormControl } from "@mui/base";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import useGet from "@/app/components/hook/useGet";

const ModalEditFormuleUser = () => {
  const { data: userData, mutate } = useGet("/api/user/getUserMeeting");
  const router = useRouter();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch();
  const [inputFormule, setInputFormule] = useState<string>(
    userData?.body.typeMeeting.type
  );
  const [validFormuleInput, setValidFormuleInput] = useState<boolean>(false);
  const [errorMessageFormule, setErrorMessageFormule] = useState<string>("");
  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditFormuleUserData",
    });
  };
  const { trigger, data } = useSWRMutation(
    "/api/user/editFormuleUser",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate(
          {
            ...data,
          },
          { revalidate: false }
        );
        dispatch({
          type: "form/closeModalEditFormuleUserData",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else if (data.status === 400) {
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch, inputFormule, mutate]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validFormuleInput === true) {
      if (userData) {
        if (userData.body.typeMeeting.type === inputFormule) {
          setErrorMessageFormule(
            "Vous ne pouvez pas selectionner la même formule"
          );
        } else {
          if (inputPseudo.length === 0) {
            const fetchEdit = async () => {
              trigger({
                pseudo: inputPseudo,
                formule: inputFormule,
              });
            };
            fetchEdit();
          }
        }
      }
    } else {
      setErrorMessageFormule("Veuillez choisir une formule");
    }
  };
  return (
    <>
      <div className={styles.modalComfirm}>
        <button
          className={styles.modalComfirm__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalComfirm__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalComfirm__h1}>Changer d&apos;offre</h1>
        <p>
          Vous pouvez avoir plus d&apos;information sur les différentes offres
          en cliquant sur le bouton ci-dessous
        </p>
        <div className={styles.modalComfirm__div}>
          <button
            className={styles.modalComfirm__div__btn}
            onClick={() => {
              dispatch({
                type: "form/closeModalEditFormuleUserData",
              });
              router.push("/tarif");
            }}
          >
            En savoir plus
          </button>
        </div>

        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Formule</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={userData?.body.typeMeeting.type}
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
                label="Formule unique"
              />
              <FormControlLabel
                value="flash"
                control={<Radio />}
                label="Formule flash"
              />
              <FormControlLabel
                value="longue"
                control={<Radio />}
                label="Formule longue"
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
          <div className={styles.modalComfirm__div}>
            <input
              className={styles.modalComfirm__div__btn}
              type="submit"
              value="Changer"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalEditFormuleUser;
