"use client";

import React, { useEffect, useState } from "react";
import styles from "../page.module.scss";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import fetchPost from "@/app/components/fetch/FetchPost";
import { AppDispatch } from "@/app/redux/store";
import Input from "@/app/components/input/Input";
import useUserResetPassword from "@/app/components/hook/user/useUserRestPassword";
import Load from "./load/Load";

const Reset = () => {
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  const { data: dataLoad, isLoading } = useUserResetPassword(token[2]);
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();
  useEffect(() => {
    if (dataLoad) {
      if (dataLoad.status === 400 || dataLoad.status === 404) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: dataLoad.message, type: "error" },
        });
        push("/");
      }
    }
  }, [dataLoad, dispatch, push]);

  const [inputPseudo, setInputPseudo] = useState<string>("");

  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>("");
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [passwordInputError, setPasswordInputError] = useState<string>("");
  const [passwordComfirmInputError, setPasswordComfirmError] =
    useState<string>("");

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/reinitialisation-mot-de-passe/[token]/components/api",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        reset();
        push("/");
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "password") {
            setPasswordInputError(element[1]);
          }
        });
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
        reset();
        push("/");
      }
    }
  }, [data, dispatch, push, reset]);
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validPasswordInput === true && validPasswordComfirmInput === true) {
      if (passwordInput === passwordComfirmInput) {
        if (inputPseudo.length === 0) {
          const fetchReset = async () => {
            trigger({
              password: validator.escape(passwordInput.trim()),
              passwordConfirm: validator.escape(passwordComfirmInput.trim()),
              token: validator.escape(token[2].trim()),
              pseudo: validator.escape(inputPseudo.trim()),
            });
          };
          fetchReset();
        }
      } else {
        setValidPasswordInput(false);
        setValidPasswordComfirmInput(false);
        setPasswordComfirmError(
          "Confirmation mot de passe : les mots de passe sont identiques"
        );
      }
    } else {
      if (validPasswordInput === false) {
        if (passwordInput.length === 0) {
          setPasswordInputError("Mot de passe : ne peut pas être vide");
        }
      }
      if (validPasswordComfirmInput === false) {
        if (passwordComfirmInput.length === 0) {
          setPasswordComfirmError(
            "Confirmation mot de passe : les mots de passe doivent être identiques"
          );
        }
      }
    }
  };

  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      removeSpace = e.target.value.replace(/\s+/g, "");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else if (
        passwordComfirmInput.length > 0 &&
        removeSpace === passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      } else {
        setValidInput(true);
        setErrorMessage("");
      }
    } else if (removeSpace.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setPasswordComfirmError(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage("");
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    } else {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setPasswordComfirmError(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    }
  };

  return (
    <>
      {/* {timer <= 0 ? null : (
        <span className={styles.reset__timer__span}>
          Temps restant pour la réinitialisation : {minutes} minutes {seconds}{" "}
          secondes
        </span>
      )} */}
      {!isLoading && dataLoad && (
        <>
        <p className={styles.reset__article__p}>
              Vous pouvez réinitialiser votre mot de passe en remplissant le
              formulaire ci-dessous.
            </p>

<form
        className={styles.reset__form}
        id="form"
        onSubmit={(e) => {
          handlerSubmit(e);
        }}
      >
        <Input
          label="Mot de passe"
          value={passwordInput}
          id="password"
          type="password"
          placeholder="Entrez votre mot de passe"
          onchange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            handlerInput(
              e,
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#=&,_])[A-Za-z\d-?!*:@~%.;+|$#=&,_]{8,}$/,
              setValidPasswordInput,
              setPasswordInputError,
              setPasswordInput,
              "Mot de passe : doit avoir une lettre en minuscule, majuscule, un nombre, un caractère spécial (-?!*:@~%.;+|$#=&,_) et 8 caractères minimum"
            );
          }}
          validInput={validPasswordInput}
          errorMessage={passwordInputError}
          image="eye-solid"
          alt="icone afficher mot de passe"
          position="first"
          tab={false}
        />
        <Input
          label="Confirmation de mot de passe"
          value={passwordComfirmInput}
          id="passwordComfirm"
          type="password"
          placeholder="Entrez votre confirmation de mot de passe"
          onchange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            let removeSpace = "";
            if (e.target.value.charAt(0) === " ") {
              removeSpace = e.target.value.replace(/\s/, "");
              setPasswordComfirmInput(removeSpace);
            } else {
              removeSpace = e.target.value.replace(/\s+/g, "");
              setPasswordComfirmInput(removeSpace);
            }
            if (passwordInput.length > 0 && removeSpace !== passwordInput) {
              setValidPasswordComfirmInput(false);
              setPasswordComfirmError(
                "Confirmation mot de passe : les mots de passe doivent être identique"
              );
            } else {
              setValidPasswordComfirmInput(true);

              setPasswordComfirmError("");
            }
          }}
          validInput={validPasswordComfirmInput}
          errorMessage={passwordComfirmInputError}
          image="eye-solid"
          alt="icone afficher mot de passe"
          tab={false}
        />
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
        <div className={styles.reset__form__submit}>
          {isMutating && (
            <button disabled className={styles.reset__form__submit__btn__load}>
              <span className={styles.reset__form__submit__btn__load__span}>
                Chargement
              </span>

              <div className={styles.reset__form__submit__btn__load__arc}>
                <div
                  className={styles.reset__form__submit__btn__load__arc__circle}
                ></div>
              </div>
            </button>
          )}
          {!isMutating && (
            <input
              className={styles.reset__form__submit__btn}
              type="submit"
              value="Réinitialiser"
            />
          )}
        </div>
      </form>

        </>
      )}
      {isLoading && (
        <Load />
      )}
    </>
  );
};

export default Reset;
