import React, { useEffect, useState } from "react";
import styles from "./ModalEditFormuleUser.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { FormControl } from "@mui/base";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import useUserGet from "@/app/components/hook/user/useUserGet";
import fetchPost from "@/app/components/fetch/user/FetchPost";
import useSWRMutation from "swr/mutation";

const ModalEditFormuleUser = () => {
  const { userData, isLoading, isError, mutate } = useUserGet();
  const router = useRouter();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch();
  const [inputFormule, setInputFormule] = useState<string>("");
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
            body: {
              ...data.body,
              typeMeeting: inputFormule,
            },
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
        <button
          onClick={() => {
            dispatch({
              type: "form/closeModalEditFormuleUserData",
            });
            router.push("/tarif");
          }}
        >
          Cliquer ici
        </button>
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
                value="formule1"
                control={<Radio />}
                label="Formule 1"
              />
              <FormControlLabel
                value="formule2"
                control={<Radio />}
                label="Formule 2"
              />
              <FormControlLabel
                value="formule3"
                control={<Radio />}
                label="Formule 3"
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
          <input type="submit" value="Envoyer" />
        </form>
      </div>
    </>
  );
};

export default ModalEditFormuleUser;
