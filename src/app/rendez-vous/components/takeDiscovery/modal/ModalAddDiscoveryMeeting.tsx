import React, { useEffect, useState } from "react";
import styles from "./ModalAddDiscoveryMeeting.module.scss";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
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
import { AnimatePresence, motion } from "framer-motion";

const ModalAddDiscoveryMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [errorMessageTypeCoaching, setErrorMessageTypeCoaching] =
    useState<string>("");
  const [validTypeCoachingInput, setValidTypeCoachingInput] =
    useState<boolean>(false);
  const [typeCoachingInput, setTypeCoachingInput] = useState<string>("");
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/api/meeting/addDiscovery",
    fetchPost
  );
  const { displayModalAddDiscoveryMeeting, dataModalAddDiscoveryMeeting } =
    useSelector((state: RootState) => state.ModalAddDiscoveryMeeting);
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalAddDiscoveryMeeting/close",
    });
  };
  const clearState = () => {
    setErrorMessageTypeCoaching("");
    setValidTypeCoachingInput(false);
    setTypeCoachingInput("");
  };
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalAddDiscoveryMeeting/close",
        });
        dispatch({
          type: "ModalDatePickerDiscovery/close",
        });
        dispatch({
          type: "ModalDatePickerEditDiscovery/reload",
        });
        clearState();
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
      reset();
    };
    if (data && data.body) {
      mutateMeetingData();
    }
  }, [data, reset]);
  const handlerClick = () => {
    const fetchAddMeeting = async () => {
      trigger({
        start: new Date(dataModalAddDiscoveryMeeting).toISOString(),
        typeCoaching: typeCoachingInput,
        timeZone: new Date().getTimezoneOffset() / 60,
      });
    };
    fetchAddMeeting();
  };
  return (
    <>
      <AnimatePresence>
        {displayModalAddDiscoveryMeeting === true && (
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
                Prise de rendez-vous de découverte
              </h1>
              <p>
                Rappel du rendez-vous :{" "}
                {new Date(dataModalAddDiscoveryMeeting).toLocaleString("fr-FR")}
              </p>
              <p>
                Pour comfirmer le rendez-vous de découverte aucune autorisation
                bancaire est nécessaire.
              </p>
              <FormControl
                style={{ margin: "30px 0px", display: "block" }}
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
                {isMutating === false && (
                  <button
                    className={styles.modalComfirm__div__btn}
                    onClick={() => {
                      dispatch({
                        type: "flash/clearFlashMessage",
                      });
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
                )}
                {isMutating === true && (
                  <button
                    disabled
                    className={styles.modalComfirm__div__btn__load}
                  >
                    <span className={styles.modalComfirm__div__btn__load__span}>
                      Chargement
                    </span>

                    <div className={styles.modalComfirm__div__btn__load__arc}>
                      <div
                        className={
                          styles.modalComfirm__div__btn__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalAddDiscoveryMeeting;
