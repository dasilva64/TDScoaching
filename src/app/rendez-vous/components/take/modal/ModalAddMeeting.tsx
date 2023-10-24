import { AppDispatch, RootState } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "./ModalAddMeeting.module.scss";
import fetchPost from "@/app/components/fetch/FetchPost";
import Image from "next/image";
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
import { AnimatePresence, motion } from "framer-motion";

const ModalAddMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dataModalAddMeeting, displayModalAddMeeting } = useSelector(
    (state: RootState) => state.ModalAddMeeting
  );
  const [validCGVInput, setValidCGVInput] = useState<boolean>(false);
  const [CGVInputError, setCGVInputError] = useState<string>("");
  const [errorMessageTypeMeeting, setErrorMessageTypeMeeting] =
    useState<string>("");
  const [validTypeMeetingInput, setValidTypeMeetingInput] =
    useState<boolean>(false);
  const [typeMeetingInput, setTypeMeetingInput] = useState<string>("");

  const closeForm = () => {
    dispatch({
      type: "ModalAddMeeting/close",
    });
  };
  const { trigger, data, isMutating, reset } = useSWRMutation(
    "/api/paiement/get",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        reset();
        window.location.href = data.url;
      } else {
        reset();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch, reset]);

  const { trigger: triggerSeveral, data: dataSeveral } = useSWRMutation(
    "/api/paiement/getSeveral",
    fetchPost
  );
  useEffect(() => {
    if (dataSeveral) {
      window.location.href = dataSeveral.url;
    }
  }, [dataSeveral]);

  const handlerPayment = () => {
    const fetchAddMeeting = async () => {
      trigger({
        start: new Date(dataModalAddMeeting).toLocaleString("en-US"),
        typeCoaching: typeMeetingInput,
      });
    };
    fetchAddMeeting();
  };

  const handlerPaymentSeveral = () => {
    const fetchAddMeeting = async () => {
      triggerSeveral({
        start: new Date(dataModalAddMeeting).toLocaleString("en-US"),
        typeCoaching: typeMeetingInput,
      });
    };
    fetchAddMeeting();
  };
  return (
    <>
      <AnimatePresence>
        {displayModalAddMeeting === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
              className={styles.modalComfirm}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: "-50%",
                x: "-50%",
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: 200,
                x: "-50%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <button
                className={styles.modalComfirm__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalComfirm__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalComfirm__h1}>
                Comfirmation de rendez-vous
              </h1>
              <p>
                Rappel du rendez-vous :{" "}
                {new Date(dataModalAddMeeting).toLocaleString("fr-FR")}
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
                    Veuillez choissir un type de coaching pour ce rendez-vous
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
                    if (
                      validCGVInput === true &&
                      validTypeMeetingInput === true
                    ) {
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
                  Payer en une seule fois
                </button>
                <button
                  className={styles.modalComfirm__div__btn}
                  onClick={() => {
                    if (
                      validCGVInput === true &&
                      validTypeMeetingInput === true
                    ) {
                      handlerPaymentSeveral();
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
                  Payer en plusieurs fois
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalAddMeeting;
