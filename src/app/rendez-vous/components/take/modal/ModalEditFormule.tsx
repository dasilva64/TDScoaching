import React, { useEffect, useState } from "react";
import styles from "./ModalEditFormule.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { FormControl } from "@mui/base";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import fetchPost from "../../../../../../src/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import useGet from "../../../../components/hook/useGet";
import { AnimatePresence, motion } from "framer-motion";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

const ModalEditFormuleUser = () => {
  const { displayModalEditFormule } = useSelector(
    (state: RootState) => state.ModalEditFormule
  );
  const {
    data: userData,
    mutate,
    isLoading,
  } = useGet("/api/user/getUserMeeting");
  const router = useRouter();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [validFormuleInput, setValidFormuleInput] = useState<boolean>(false);
  const [errorMessageFormule, setErrorMessageFormule] = useState<string>("");
  const dispatch = useDispatch();
  const [inputFormule, setInputFormule] = useState<string>("");
  const clearState = () => {
    setInputFormule("");
    setInputPseudo("");
    setValidFormuleInput(false);
    setErrorMessageFormule("");
  };
  useEffect(() => {
    if (isLoading) {
      setInputFormule("");
    } else {
      if (userData) {
        if (userData.status === 200) {
          setInputFormule(userData.body.typeMeeting.type);
          setValidFormuleInput(true);
        } else {
          setInputFormule("");
        }
      }
    }
  }, [isLoading, userData]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalEditFormule/close",
    });
  };
  const { trigger, data, reset } = useSWRMutation(
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
        reset();
        dispatch({
          type: "ModalEditFormule/close",
        });
        clearState();
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
  }, [data, dispatch, inputFormule, mutate, reset]);
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
            if (inputFormule === "unique") {
              dispatch({
                type: "ModalComfirmDeleteContrat/open",
              });
            } else if (inputFormule === "flash") {
              dispatch({
                type: "ModalComfirmEditContrat/open",
              });
            } else {
              const fetchEdit = async () => {
                trigger({
                  pseudo: inputPseudo,
                  formule: inputFormule,
                });
                setInputFormule(userData?.body.typeMeeting.type);
                setValidFormuleInput(false);
                setErrorMessageFormule("");
              };
              fetchEdit();
            }
          }
        }
      }
    } else {
      setErrorMessageFormule("Veuillez choisir une formule");
    }
  };
  return (
    <>
      <AnimatePresence>
        {displayModalEditFormule === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
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
              <h1 className={styles.modalComfirm__h1}>Changer d&apos;offre</h1>
              <p>Offre actuelle : {userData.body.typeMeeting.type}</p>
              <p>
                Vous pouvez avoir plus d&apos;information sur les différentes
                offres en cliquant sur le bouton ci-dessous
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
                  <FormLabel id="demo-radio-buttons-group-label">
                    Formule
                  </FormLabel>
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
                      value="custom"
                      control={<Radio />}
                      label="Formule custom"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalEditFormuleUser;
