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
import fetchPost from "@/app/components/fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

const ModalDeleteAccount = () => {
  const { displayModalDeleteAccount } = useSelector(
    (state: RootState) => state.ModalDeleteAccount
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [reason, setReason] = useState<string>("");
  const [reasonErrorMessage, setReasonErrorMessage] = useState<string>("");
  const [reasonValid, setReasonValid] = useState<boolean>(false);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messageInputError, setMessageInputError] = useState<string>("");
  const [validinputMessage, setValidInputMessage] = useState<boolean>(false);
  const { data, trigger } = useSWRMutation(
    "/api/user/deleteAccountSendEmail",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "ModalDeleteAccount/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
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
          router.push("/rendez-vous");
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
        }
      }
    }
  }, [data, dispatch, router]);

  const closeForm = () => {
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
              <h1 className={styles.modalDeleteAccount__h1}>
                Suppression du compte
              </h1>
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
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    <MenuItem value={"autre"}>Autre</MenuItem>
                  </Select>
                  <FormHelperText>{reasonErrorMessage}</FormHelperText>
                </FormControl>
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
                <button
                  onClick={() => {
                    if (reasonValid) {
                      trigger();
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalDeleteAccount;
