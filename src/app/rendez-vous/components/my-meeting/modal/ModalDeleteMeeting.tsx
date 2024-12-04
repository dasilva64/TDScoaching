import React, { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import fetchGet from "../../../../../../src/app/components/fetch/fetchGet";
import styles from "./ModalDeleteMeeting.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { RootState } from "@/app/redux/store";
import useGet from "../../../../components/hook/useGet";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";

const ModalDeleteMeeting = () => {
  const dispatch = useDispatch();
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserMeeting");

  const [validCheck, setValidCheck] = useState<boolean>(false);
  const [errorMessageCheck, setErrorMessageCheck] = useState<string>("");
  const { trigger, data, reset } = useSWRMutation(
    "/api/paiement/cancel",
    fetchGet
  );
  /* const { displayModalDeleteMeeting } = useSelector(
    (state: RootState) => state.ModalDeleteMeeting
  ); */
  useEffect(() => {
    if (data && data.status === 200) {
      if (data.status === 200) {
        mutate("/api/user/getUserMeeting", {
          ...data,
        });
        reset();
        dispatch({
          type: "ModalDeleteMeeting/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalDatePickerEdit/reload",
        });
        dispatch({
          type: "ModalDatePicker/reload",
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch, reset]);
  const closeForm = () => {
    dispatch({
      type: "ModalDeleteMeeting/close",
    });
  };
  return (
    <>
      <AnimatePresence>
        {/* {displayModalDeleteMeeting && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
              className={styles.deleteModal}
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
                className={styles.deleteModal__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.deleteModal__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              {userData.body.meeting.typeMeeting.type === "unique" && (
                <>
                  <h1 className={styles.deleteModal__h1}>
                    Voulez vous vraiment supprimer ce rendez-vous
                  </h1>
                  <p>
                    Si vous supprimer ce rendez-vous le paiement que vous avez
                    effectué ne sera pas validé et aucun argent ne sera débité
                    de votre compte.
                  </p>
                  <FormControl
                    style={{ margin: "10px 0px" }}
                    component="fieldset"
                    variant="standard"
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              if (e.target.checked === true) {
                                setValidCheck(true);
                                setErrorMessageCheck("");
                              } else {
                                setValidCheck(false);
                                setErrorMessageCheck(
                                  "Vous devez cochée la case pour valider la suppression"
                                );
                              }
                            }}
                            name="gilad"
                          />
                        }
                        label={"Cocher la case pour valider la suppression"}
                      />
                    </FormGroup>
                    <FormHelperText>{errorMessageCheck}</FormHelperText>
                  </FormControl>
                  <div className={styles.deleteModal__div}>
                    <button
                      className={styles.deleteModal__div__btn}
                      onClick={() => {
                        if (validCheck === true) {
                          const fetchAddMeeting = async () => {
                            trigger();
                          };
                          fetchAddMeeting();
                        } else {
                          setErrorMessageCheck("Veuillez cocher la case");
                        }
                      }}
                    >
                      Suppression
                    </button>
                  </div>
                </>
              )}
              {userData.body.meeting.typeMeeting.type !== "unique" && (
                <>
                  <h1 className={styles.deleteModal__h1}>
                    Voulez vous vraiment supprimer votre offre en cours
                  </h1>
                  <p>
                    Vous disposez d&apos;une offre{" "}
                    <strong>{userData.body.meeting.typeMeeting.type}</strong>{" "}
                    avec plusieurs rendez-vous, si vous décidez d&apos;annuler
                    l&apos;offre, vous serez remboursé de la somme restante.
                  </p>
                  <p>
                    Vous serez remboursé ici de{" "}
                    {userData.body.meeting.typeMeeting.number * 100} euros.
                  </p>
                  <FormControl
                    style={{ margin: "10px 0px" }}
                    component="fieldset"
                    variant="standard"
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              if (e.target.checked === true) {
                                setValidCheck(true);
                                setErrorMessageCheck("");
                              } else {
                                setValidCheck(false);
                                setErrorMessageCheck(
                                  "Vous devez cochée la case pour valider la l'annulation de l'offre"
                                );
                              }
                            }}
                            name="gilad"
                          />
                        }
                        label={
                          "Cocher la case pour valider l'anulation de l'offre"
                        }
                      />
                    </FormGroup>
                    <FormHelperText>{errorMessageCheck}</FormHelperText>
                  </FormControl>
                  <div className={styles.deleteModal__div}>
                    <button
                      className={styles.deleteModal__div__btn}
                      onClick={() => {
                        if (validCheck === true) {
                          const fetchAddMeeting = async () => {
                            trigger();
                          };
                          fetchAddMeeting();
                        } else {
                          setErrorMessageCheck("Veuillez cocher la case");
                        }
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )} */}
      </AnimatePresence>
    </>
  );
};

export default ModalDeleteMeeting;
