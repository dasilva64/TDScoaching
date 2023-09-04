import { AppDispatch, RootState } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "./ModalAddMeeting.module.scss";
import fetchPost from "@/app/components/fetch/FetchPost";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import Link from "next/link";

const ModalAddMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dataModalMeeting } = useSelector((state: RootState) => state.form);
  const [validCGVInput, setValidCGVInput] = useState<boolean>(false);
  const [CGVInputError, setCGVInputError] = useState<string>("");
  const [errorMessageTypeMeeting, setErrorMessageTypeMeeting] =
    useState<string>("");
  const [validTypeMeetingInput, setValidTypeMeetingInput] =
    useState<boolean>(false);
  const [typeMeetingInput, setTypeMeetingInput] = useState<string>("");

  const closeForm = () => {
    dispatch({
      type: "form/closeModalMeeting",
    });
  };
  const { trigger, data } = useSWRMutation("/api/paiement/get", fetchPost);
  useEffect(() => {
    if (data) {
      console.log(data);
      window.location.href = data.url;
    }
  }, [data]);
  const handlerPayment = () => {
    const fetchAddMeeting = async () => {
      //console.log(new Date(dataModalMeeting).toLocaleString("en-US"));
      trigger({
        start: new Date(dataModalMeeting).toLocaleString("en-US"),
        typeCoaching: typeMeetingInput,
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
        <h1 className={styles.modalComfirm__h1}>Comfirmation de rendez-vous</h1>
        <p>
          Rappel du rendez-vous :{" "}
          {new Date(dataModalMeeting).toLocaleString("fr-FR")}
        </p>
        <p>
          Pour comfirmer le rendez-vous une autorisation bancaire est
          nécessaire. Aucune somme ne sera débitée avant la fin de la
          consultation vidéo.
        </p>
        <Link href={""}>Conditions générales de ventes</Link>
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
                setTypeMeetingInput(e.target.value);
                setValidTypeMeetingInput(true);
                setErrorMessageTypeMeeting("");
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
              {errorMessageTypeMeeting}
            </FormHelperText>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked === true) {
                      setValidCGVInput(true);
                      setCGVInputError("");
                    } else {
                      setValidCGVInput(false);
                      setCGVInputError(
                        "Vous devez accepter les conditions générales de vente pour continuer"
                      );
                    }
                  }}
                  name="gilad"
                />
              }
              label="J'ai lu et j'accepte les conditions générales de vente"
              labelPlacement="end"
            />
          </FormGroup>
          <FormHelperText>{CGVInputError}</FormHelperText>
        </FormControl>
        <div className={styles.modalComfirm__div}>
          <button
            className={styles.modalComfirm__div__btn}
            onClick={() => {
              if (validCGVInput === true && validTypeMeetingInput === true) {
                handlerPayment();
              } else {
                if (validTypeMeetingInput === false) {
                  setErrorMessageTypeMeeting(
                    "Vous devez choisir un type de coaching pour continuer"
                  );
                }
                if (validCGVInput === false) {
                  setCGVInputError(
                    "Vous devez accepter les conditions générales de vente pour continuer"
                  );
                }
              }
            }}
          >
            Payer pour comfirmer
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddMeeting;
