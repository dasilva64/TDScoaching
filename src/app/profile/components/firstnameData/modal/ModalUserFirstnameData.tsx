"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserFirstnameData.module.scss";
import useSWRMutation from "swr/mutation";
import fetchPost from "../../../../components/fetch/FetchPost";
import Image from "@/app/components/image/Image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/app/components/input/Input";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { mutate as globalMutate } from "swr";

const ModalUserFirstnameData = ({ data: userData, mutate }: any) => {
  const router = useRouter();
  const { displayModalEditFirstname } = useSelector(
    (state: RootState) => state.ModalEditFirstname
  );
  const dispatch = useDispatch<AppDispatch>();
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [firstnameInput, setFirstnameInput] = useState<string>(
    userData.body.firstname
  );

  const [validFirstnameInput, setValidFirstnameInput] = useState<boolean>(true);
  const [errorMessageFirstname, setErrorMessageFirstname] =
    useState<string>("");

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/firstnameData/modal/api",
    fetchPost
  );
  useEffect(() => {
    const clearState = () => {
      setErrorMessageFirstname("");
      setValidFirstnameInput(true);
    };
    if (data) {
      if (data.status === 200) {
        mutate(
          {
            ...data,
            body: {
              ...data.body,
              firstname: firstnameInput,
            },
          },
          {
            revalidate: false,
          }
        );
        globalMutate("/components/header/api");
        reset();
        if (isMutating === false) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          dispatch({
            type: "ModalEditFirstname/close",
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
        router.push(`/acces-refuse?destination=profile`);
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "firstname") {
              setErrorMessageFirstname(element[1]);
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
    firstnameInput,
    isMutating,
    mutate,
    reset,
    router,
    userData,
  ]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalEditFirstname/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validFirstnameInput === true) {
      if (inputPseudo.length === 0) {
        const fetchLogin = async () => {
          trigger({
            firstname: firstnameInput.trim(),
            pseudo: inputPseudo.trim(),
            csrfToken: csrfToken
          });
        };
        fetchLogin();
      }
    } else {
      if (validFirstnameInput === false) {
        if (firstnameInput.length === 0) {
          setErrorMessageFirstname("Prénom : ne peut pas être vide");
        } else {
          setErrorMessageFirstname(
            "Prénom : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
          );
        }
      }
    }
  };
  const clearState = () => {
    setFirstnameInput(userData.body.firstname);
    setErrorMessageFirstname("");
    setValidFirstnameInput(true);
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
      <TabIndex displayModal={displayModalEditFirstname} />
      <AnimatePresence>
        {displayModalEditFirstname === true && (
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
                Modifier votre prénom
              </h2>
              <form
                action=""
                method="POST"
                className={styles.modalEditMainUserData__form}
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <Input
                  label="Prénom"
                  value={firstnameInput ? firstnameInput : ""}
                  id="firstname"
                  type="text"
                  placeholder="Entrez votre prénom"
                  onchange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    handlerInput(
                      e,
                      "firstname",
                      /^[A-Za-zÀ-ÿ][a-zA-ZÀ-ÿ</> ]{3,40}$/,
                      setValidFirstnameInput,
                      setErrorMessageFirstname,
                      setFirstnameInput,
                      "Prénom : ne peut contenir que des lettres et doit contenir entre 3 et 40 caractères"
                    );
                  }}
                  validInput={validFirstnameInput}
                  errorMessage={errorMessageFirstname}
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
                  {!isMutating && (
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

export default ModalUserFirstnameData;
