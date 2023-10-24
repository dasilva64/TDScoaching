import React, { useEffect, useState } from "react";
import styles from "./ModalAddMeetingAdmin.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import useGet from "@/app/components/hook/useGet";
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { useSelect } from "@mui/base";
import fetchPost from "@/app/components/fetch/FetchPost";
import { mutate } from "swr";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { AnimatePresence, motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";

const ModalAddMeetingAdmin = () => {
  const { displayModalAddMeetingAdmin, dataModalAddMeetingAdmin } = useSelector(
    (state: RootState) => state.ModalAddMeetingAdmin
  );
  const { data, isLoading, isError } = useGet("/api/user/getAll");
  const [searchInput, setSearchInput] = useState<string>("");
  const [validSearchInput, setValidSearchInput] = useState<boolean>(false);
  const [errorMessageSearch, setErrorMessageSearch] = useState<string>("");
  const [arrayData, setArrayData] = useState<any[]>([]);
  const [choiceUser, setChoiceUser] = useState<any[]>([]);
  const clearState = () => {
    setSearchInput("");
    setValidSearchInput(false);
    setErrorMessageSearch("");
    setArrayData([]);
    setChoiceUser([]);
  };
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: dataMutate,
    trigger,
    reset,
  } = useSWRMutation("/api/meeting/add", fetchPost);
  useEffect(() => {
    if (dataMutate) {
      if (dataMutate.status === 200) {
        mutate(
          "/api/meeting/getAllAfterNow",
          {
            ...dataMutate,
            body: [...dataMutate.body],
          },
          { revalidate: false }
        );
        reset();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataMutate.message },
        });
        dispatch({
          type: "ModalAddMeetingAdmin/close",
        });
        clearState();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataMutate.message },
        });
        clearState();
      }
    }
  }, [dataMutate, dispatch, reset]);
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalAddMeetingAdmin/close",
    });
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
    setSearchInput(e.target.value);
    if (e.target.value.length > 0) {
      if (data && data.body) {
        let copyDataBody = data.body;
        let copyDataBodyFilter = copyDataBody.filter((element: any) => {
          return (
            element.mail.includes(e.target.value) ||
            element.lastName.includes(e.target.value) ||
            element.firstName.includes(e.target.value)
          );
        });
        if (copyDataBodyFilter.length > 0) {
          setArrayData(copyDataBodyFilter);
          setErrorMessageSearch("");
        } else {
          setErrorMessageSearch("Aucun utilisateur trouvé");
          setArrayData([]);
        }
      }
    } else {
      setArrayData([]);
      setErrorMessageSearch("");
    }
  };
  return (
    <>
      <AnimatePresence>
        {displayModalAddMeetingAdmin === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalAddMeeting}
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
                className={styles.modalAddMeeting__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalAddMeeting__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalAddMeeting__h1}>
                Ajouter un client à ce rendez-vous
              </h1>
              <p>
                Rappel rendez-vous :{" "}
                {new Date(dataModalAddMeetingAdmin).toLocaleString("fr-FR")}
              </p>
              <FormControl
                variant="standard"
                style={{ width: "100%", marginTop: "20px" }}
              >
                <InputLabel
                  sx={{
                    color: "black",
                    "&.Mui-focused": {
                      color: "#1976d2",
                    },
                  }}
                  htmlFor="standard-adornment-user"
                >
                  Utilisateur
                </InputLabel>
                <Input
                  autoFocus
                  id="standard-adornment-user"
                  value={searchInput}
                  placeholder={"Entrez le prénom, nom ou mail de l'utilisateur"}
                  type={"text"}
                  onChange={(e) => {
                    handlerInput(
                      e,
                      "email",
                      /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                      setValidSearchInput,
                      setErrorMessageSearch,
                      setSearchInput,
                      "Recherche : doit avoir un format valide"
                    );
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <PersonIcon
                        aria-label="toggle firstname visibility"
                        sx={{ padding: "0px", color: "black" }}
                      >
                        <Visibility />
                      </PersonIcon>
                    </InputAdornment>
                  }
                />
                <FormHelperText style={{ color: "red" }}>
                  {errorMessageSearch}
                </FormHelperText>
              </FormControl>
              {/* <TextField
                style={{ width: "100%" }}
                autoFocus
                value={searchInput}
                id={"email"}
                label={"Email"}
                variant="standard"
                type={"email"}
                placeholder={"Entrez votre mail"}
                FormHelperTextProps={{ style: { color: "red" } }}
                onChange={(e) => {
                  handlerInput(
                    e,
                    "email",
                    /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                    setValidSearchInput,
                    setErrorMessageSearch,
                    setSearchInput,
                    "Recherche : doit avoir un format valide"
                  );
                }}
                helperText={errorMessageSearch}
              /> */}
              {arrayData.length > 0 && (
                <div className={styles.modalAddMeeting__div}>
                  {arrayData.map((element: any, index: number) => {
                    return (
                      <div
                        className={styles.modalAddMeeting__div__choice}
                        key={index}
                        onClick={() => {
                          setChoiceUser([element]);
                          setSearchInput("");
                          setArrayData([]);
                        }}
                      >
                        <p>{element.mail}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {choiceUser.length === 1 && (
                <div className={styles.modalAddMeeting__content}>
                  <p className={styles.modalAddMeeting__content__p}>
                    <strong>Utilisateur selectionné</strong> :{" "}
                    {choiceUser[0].mail}
                  </p>
                  <button
                    className={styles.modalAddMeeting__content__btn}
                    onClick={() => {
                      setChoiceUser([]);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
              {choiceUser.length === 0 && (
                <div className={styles.modalAddMeeting__content}>
                  <button
                    className={styles.modalAddMeeting__content__btn}
                    onClick={() => {
                      trigger({
                        start: new Date(
                          dataModalAddMeetingAdmin
                        ).toLocaleString("en-US"),
                      });
                    }}
                  >
                    Créer un rendez-vous sans utilisateur
                  </button>
                </div>
              )}
              {choiceUser.length === 1 && (
                <div className={styles.modalAddMeeting__content}>
                  <button
                    className={styles.modalAddMeeting__content__btn}
                    onClick={() => {
                      trigger({
                        start: new Date(
                          dataModalAddMeetingAdmin
                        ).toLocaleString("en-US"),
                        userId: choiceUser[0].id,
                      });
                    }}
                  >
                    Créer un rendez-vous avec l&apos;utilisateur
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalAddMeetingAdmin;
