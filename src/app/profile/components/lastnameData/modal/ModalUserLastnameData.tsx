"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserLastnameData.module.scss";
import useSWRMutation from "swr/mutation";
import fetchPost from "../../../../components/fetch/FetchPost";
import Image from "@/app/components/image/Image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Input from "@/app/components/input/Input";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { mutate as globalMutate } from "swr";

const ModalUserLastnameData = ({ data: userData, mutate }: any) => {
  const { displayModalEditLastname } = useSelector(
    (state: RootState) => state.ModalEditLastname
  );
  const { csrfToken } = useSelector(
    (state: RootState) => state.csrfToken
  );
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [lastnameInput, setLastnameInput] = useState<string>(
    userData.body.lastname
  );
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(true);
  const [errorMessageLastname, setErrorMessageLastname] = useState<string>("");

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/lastnameData/modal/api",
    fetchPost
  );

  useEffect(() => {
    const clearState = () => {
      setErrorMessageLastname("");
      setValidLastnameInput(true);
    };
    if (data) {
      if (data.status === 200) {
        mutate(
          {
            ...data,
            body: {
              ...data.body,
              lastname: lastnameInput,
            },
          },
          { revalidate: false }
        );
        globalMutate("/components/header/api");
        reset();
        if (isMutating === false) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          dispatch({
            type: "ModalEditLastname/close",
          });
          clearState();
        }
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        globalMutate("/components/header/api");
                globalMutate("/components/header/ui/api");
        router.push("/");
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "lastname") {
              setErrorMessageLastname(element[1]);
            }
          });
          reset();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [
    data,
    dispatch,
    isMutating,
    lastnameInput,
    mutate,
    reset,
    router,
    userData,
  ]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalEditLastname/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validLastnameInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({
            lastname: lastnameInput.trim(),
            pseudo: inputPseudo.trim(),
            csrfToken: csrfToken
          });
        };
        fetchLogin();
      }
    } else {
      if (validLastnameInput === false) {
        if (lastnameInput.length === 0) {
          setErrorMessageLastname("Nom de famille : ne peut pas être vide");
        } else {
          setErrorMessageLastname(
            "Nom de famille : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
          );
        }
      }
    }
  };
  const clearState = () => {
    setLastnameInput(userData.body.lastname);
    setErrorMessageLastname("");
    setValidLastnameInput(true);
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
      removeSpace = e.target.value.replace(/\s+/g, " ");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      setValidInput(true);
      setErrorMessage("");
    } else if (removeSpace.length === 0) {
      setValidInput(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setErrorMessage(errorMessage);
    }
  };
  return (
    <>
      <TabIndex displayModal={displayModalEditLastname} />
      <AnimatePresence>
        {displayModalEditLastname === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalEditMainUserData}
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
                type="button"
                className={styles.modalEditMainUserData__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.modalEditMainUserData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalEditMainUserData__h1}`}>
                Modifier votre nom de famille
              </h2>
              <form
                className={styles.modalEditMainUserData__form}
                action=""
              method="POST"
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <Input
                  label="Nom de famille"
                  value={lastnameInput}
                  id="lastname"
                  type="text"
                  placeholder="Entrez votre nom de famille"
                  onchange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    handlerInput(
                      e,
                      "lastname",
                      /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ ]{3,40}$/,
                      setValidLastnameInput,
                      setErrorMessageLastname,
                      setLastnameInput,
                      "Nom de famille : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
                    );
                  }}
                  validInput={validLastnameInput}
                  errorMessage={errorMessageLastname}
                  image="user-solid"
                  alt="icone utilisateur"
                  position="first"
                  tab={true}
                />

                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalEditMainUserData__form__hidden}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <div className={styles.modalEditMainUserData__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalEditMainUserData__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalEditMainUserData__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalEditMainUserData__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalEditMainUserData__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <input
                        className={
                          styles.modalEditMainUserData__form__submit__btn
                        }
                        type="submit"
                        value="Modifier"
                      />
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalUserLastnameData;
