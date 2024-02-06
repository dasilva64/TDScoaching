import React, { useEffect, useState } from "react";
import styles from "./ModalDeleteAccount.module.scss";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
import Textarea from "@mui/joy/Textarea";
import { FormHelperText, FormLabel, TextField } from "@mui/material";
import fetchPost from "../../../../../../src/app/components/fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";
import { RootState } from "@/app/redux/store";
import Image from "next/image";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../../../Parisienne-Regular.ttf",
  display: "swap",
});

const ModalDeleteAccount = () => {
  const { displayModalDeleteAccount } = useSelector(
    (state: RootState) => state.ModalDeleteAccount
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [reasonErrorMessage, setReasonErrorMessage] = useState<string>("");
  const [reasonValid, setReasonValid] = useState<boolean>(false);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messageInputError, setMessageInputError] = useState<string>("");
  const [validinputMessage, setValidInputMessage] = useState<boolean>(false);
  const { data, trigger, isMutating, reset } = useSWRMutation(
    "/profile/components/deleteAccount/modal/api",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        clearState();
        if (isMutating === false) {
          dispatch({
            type: "ModalDeleteAccount/close",
          });
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          reset();
        }
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "reason") {
              setMessageInputError(element[1]);
            }
          });
          reset();
        } else {
          if (
            data.message ===
            "Vous ne pouvez pas supprimer votre compte car vous avez un rendez-vous de prévu"
          ) {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: data.message },
            });
            dispatch({
              type: "ModalDeleteAccount/close",
            });
            reset();
            router.push("/rendez-vous");
          } else {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: data.message },
            });
            reset();
          }
        }
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      }
    }
  }, [data, dispatch, isMutating, reset, router]);
  const clearState = () => {
    setReason("");
    setReasonValid(false);
    setReasonErrorMessage("");
    setInputMessage("");
    setMessageInputError("");
    setValidInputMessage(false);
  };
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalDeleteAccount/close",
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setReason(event.target.value);
    if (event.target.value === "") {
      setReasonErrorMessage("Veuillez selectionner une raison");
      setReasonValid(false);
    } else {
      if (event.target.value === "autre") {
        setDisplayInput(true);
        setReasonValid(false);
        setReasonErrorMessage("");
        setMessageInputError("");
      } else {
        setDisplayInput(false);
        setReasonErrorMessage("");
        setReasonValid(true);
      }
    }
  };

  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
    regex: RegExp,
    setValidInput: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string
  ) => {
    let removeSpace = "";
    if (e.target.value.charAt(0) === " ") {
      removeSpace = e.target.value.replace(/\s/, "");
      setInput(removeSpace);
    } else {
      removeSpace = e.target.value.replace(/\s\s+/g, " ");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      setValidInput(true);
      setReasonValid(true);
      setErrorMessage("");
    } else if (removeSpace.length === 0) {
      setValidInput(false);
      setReasonValid(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setReasonValid(false);
      setErrorMessage(errorMessage);
    }
  };
  return (
    <>
      <AnimatePresence>
        {displayModalDeleteAccount === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              onClick={() => closeForm()}
              className={styles.bg}
            />
            <motion.div
              className={styles.modalDeleteAccount}
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
                className={styles.modalDeleteAccount__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalDeleteAccount__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2
                className={`${styles.modalDeleteAccount__h1} ${Parisienne.className}`}
              >
                Suppression du compte
              </h2>
              <div className={styles.modalDeleteAccount__div}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="reasonInput">
                    Selectionnez une raison de la suppression de votre compte
                  </InputLabel>
                  <Select
                    labelId="Selectionnez une raison de la suppression de votre compte"
                    id="reasonSelect"
                    value={reason}
                    onChange={handleChange}
                    label="Age"
                  >
                    <MenuItem value="">
                      <em>
                        Selectionnez une raison de la suppression de votre
                        compte
                      </em>
                    </MenuItem>
                    <MenuItem
                      value={
                        "Vous avez atteint vos objectifs de coaching de vie et vous n'avez plus besoin des services offerts par le site"
                      }
                    >
                      Vous avez atteint vos objectifs de coaching de vie et vous
                      avez plus besoin des services offerts par le site
                    </MenuItem>
                    <MenuItem
                      value={
                        "Vous n&apos;êtes plus satisfait des services ou du coaching fourni par le site"
                      }
                    >
                      Vous n&apos;êtes plus satisfait des services ou du
                      coaching fourni par le site
                    </MenuItem>
                    <MenuItem
                      value={
                        "Des problèmes techniques récurrents ou persistants sur le site"
                      }
                    >
                      Des problèmes techniques récurrents ou persistants sur le
                      site
                    </MenuItem>
                    <MenuItem
                      value={
                        "Supprimer les données de mon compte pour protéger ma vie privée en ligne"
                      }
                    >
                      Supprimer les données de mon compte pour protéger ma vie
                      privée en ligne
                    </MenuItem>
                    <MenuItem value={"autre"}>Autre</MenuItem>
                  </Select>
                  <FormHelperText style={{ color: "red" }}>
                    {reasonErrorMessage}
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
                {displayInput && (
                  <>
                    <FormLabel>Raison</FormLabel>
                    <Textarea
                      autoFocus
                      value={inputMessage}
                      onChange={(e) => {
                        handlerInput(
                          e,
                          "message",
                          /^[A-Za-z][A-Za-z0-9,?;.:!() ]{1,}$/,
                          setValidInputMessage,
                          setMessageInputError,
                          setInputMessage,
                          "Raison : doit contenir au moins 2 caractères (lettres, chiffres, ponctuation) et doit commencer par une lettre"
                        );
                      }}
                      placeholder="Entrez votre message"
                      minRows={2}
                    />
                    <FormHelperText>{messageInputError}</FormHelperText>
                  </>
                )}
                {isMutating && (
                  <>
                    <button
                      disabled
                      className={styles.modalDeleteAccount__btn__delete__load}
                    >
                      <span
                        className={
                          styles.modalDeleteAccount__btn__delete__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.modalDeleteAccount__btn__delete__load__arc
                        }
                      >
                        <div
                          className={
                            styles.modalDeleteAccount__btn__delete__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  </>
                )}
                {isMutating === false && (
                  <>
                    <button
                      onClick={() => {
                        if (reasonValid) {
                          if (inputPseudo.length === 0) {
                            trigger({ reason: reason, pseudo: inputPseudo });
                          }
                        } else {
                          if (validinputMessage === true) {
                            setMessageInputError("");
                          } else if (
                            validinputMessage === false &&
                            reasonValid === false &&
                            displayInput === false
                          ) {
                            setReasonErrorMessage(
                              "Veuillez selectionner une raison"
                            );
                          } else {
                            setMessageInputError(
                              "Veuillez selectionner une raison"
                            );
                          }
                        }
                      }}
                      className={styles.modalDeleteAccount__btn__delete}
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalDeleteAccount;
