import React, { useEffect, useState } from "react";
import styles from "./ModalAddDiscoveryMeeting.module.scss";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { mutate } from "swr";
import {
  FormGroup,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";

const ModalAddFirstMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [errorMessageTypeCoaching, setErrorMessageTypeCoaching] =
    useState<string>("");
  const [validTypeCoachingInput, setValidTypeCoachingInput] =
    useState<boolean>(false);
  const [typeCoachingInput, setTypeCoachingInput] = useState<string>("");
  const { trigger, data } = useSWRMutation(
    "/api/meeting/addDiscovery",
    fetchPost
  );
  const { dataModalFirstMeeting } = useSelector(
    (state: RootState) => state.form
  );
  const closeForm = () => {
    dispatch({
      type: "form/closeModalFirstMeeting",
    });
  };
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalFirstMeeting",
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "typeCoaching") {
            setErrorMessageTypeCoaching(element[1]);
          }
          if (element[0] === "start") {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: element[1] },
            });
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
    const mutateMeetingData = async () => {
      mutate(
        "/api/user/getUserMeeting",
        {
          ...data,
        },
        { revalidate: false }
      );
    };
    if (data && data.body) {
      mutateMeetingData();
    }
  }, [data]);
  const handlerClick = () => {
    const fetchAddMeeting = async () => {
      console.log(new Date(dataModalFirstMeeting).toISOString());
      trigger({
        start: new Date(dataModalFirstMeeting).toISOString(),
        typeCoaching: typeCoachingInput,
        timeZone: new Date().getTimezoneOffset() / 60,
      });
    };
    fetchAddMeeting();
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
        <h1 className={styles.modalComfirm__h1}>
          Prise de rendez-vous de découverte
        </h1>
        <p>
          Rappel du rendez-vous :{" "}
          {new Date(dataModalFirstMeeting).toLocaleString("fr-FR")}
        </p>
        <p>
          Pour comfirmer le rendez-vous de découverte aucune autorisation
          bancaire est nécessaire.
        </p>
        <FormControl
          style={{ margin: "10px 0px", display: "block" }}
          component="fieldset"
          variant="standard"
        >
          <FormGroup>
            <FormLabel id="demo-radio-buttons-group-label">
              Type de coaching
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={(e) => {
                setTypeCoachingInput(e.target.value);
                setValidTypeCoachingInput(true);
                setErrorMessageTypeCoaching("");
              }}
            >
              <FormControlLabel
                value="familial"
                control={<Radio />}
                label="Coaching familial"
              />
              <FormControlLabel
                value="couple"
                control={<Radio />}
                label="Coaching de couple"
              />
              <FormControlLabel
                value="professionnel"
                control={<Radio />}
                label="Coaching professionnel"
              />
            </RadioGroup>
            <FormHelperText style={{ color: "red", margin: "0px" }}>
              {errorMessageTypeCoaching}
            </FormHelperText>
          </FormGroup>
        </FormControl>
        <div className={styles.modalComfirm__div}>
          <button
            className={styles.modalComfirm__div__btn}
            onClick={() => {
              if (validTypeCoachingInput === true) {
                handlerClick();
              } else {
                setErrorMessageTypeCoaching(
                  "Veuillez choisir un type de coaching"
                );
              }
            }}
          >
            Comfirmer
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddFirstMeeting;
