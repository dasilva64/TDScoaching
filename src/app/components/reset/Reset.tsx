"use client";

import React, { useEffect, useState } from "react";
import styles from "../../reinitialisation-mot-de-passe/[token]/page.module.scss";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import fetchResetUserPassword from "../hook/useReset";

const Reset = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();
  const { token } = useParams();
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputPasswordComfirm, setInputPasswordComfirm] = useState<string>("");
  const [validInputPassword, setValidInputPassword] = useState<boolean>(false);
  const [validInputPasswordComfirm, setValidInputPasswordComfirm] =
    useState<boolean>(false);
  const [inputPasswordError, setInputPasswordError] = useState<string>("");
  const [inputPasswordComfirmError, setInputPasswordComfirmError] =
    useState<string>("");

  const handlerPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^(?=.*[a-z]).{1,}$/;
    if (regex.test(e.target.value)) {
      handler(e, true, "", "password");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "password");
    } else {
      handler(
        e,
        false,
        "Password : Need a letter in lower case, a number and 8 characters minimum",
        "password"
      );
    }
    if (inputPasswordComfirm === e.target.value) {
      handler(e, true, "", "passwordComfirm");
    } else if (inputPasswordComfirm !== e.target.value) {
      handler(
        e,
        false,
        "Password comfirm : need to be same password",
        "passwordComfirm"
      );
    }
  };
  const handlerPasswordComfirmInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value === inputPassword) {
      handler(e, true, "", "passwordComfirm");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "passwordComfirm");
    } else {
      handler(
        e,
        false,
        "Password comfirm : need to be same password",
        "passwordComfirm"
      );
    }
  };

  const handler = (e: any, valid: boolean, text: string, type: string) => {
    if (type === "password") {
      setInputPassword(e.target.value);
      setValidInputPassword(valid);
      setInputPasswordError(text);
    } else if (type === "passwordComfirm") {
      setInputPasswordComfirm(e.target.value);
      setValidInputPasswordComfirm(valid);
      setInputPasswordComfirmError(text);
    }
    return valid;
  };

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/reset",
    fetchResetUserPassword
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        push("/");
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
        push("/");
      }
    }
  }, [data, dispatch, push]);
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validInputPassword === true && validInputPasswordComfirm === true) {
      const fetchReset = async () => {
        trigger({ password: inputPassword, token: token });
      };
      fetchReset();
    } else {
      if (validInputPassword === false) {
        setInputPasswordError("Password : need to be not empty");
      }
      if (validInputPasswordComfirm === false) {
        setInputPasswordComfirmError("Password Comfirm : need to be not empty");
      }
    }
  };
  return (
    <form
      className={styles.reset__form}
      id="form"
      onSubmit={(e) => {
        handlerSubmit(e);
      }}
    >
      <div className={styles.reset__form__div}>
        <label className={styles.reset__form__label} htmlFor="password">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className={styles.reset__form__input}
          onChange={(e) => {
            handlerPasswordInput(e);
          }}
        />
        <div className={styles.reset__form__input__error}>
          {inputPasswordError}
        </div>
      </div>
      <div className={styles.reset__form__div}>
        <label className={styles.reset__form__label} htmlFor="passwordComfirm">
          Comfirmation du mot de passe
        </label>
        <input
          type="password"
          id="passwordComfirm"
          name="passwordComfirm"
          className={styles.reset__form__input}
          onChange={(e) => {
            handlerPasswordComfirmInput(e);
          }}
        />
        <div className={styles.reset__form__input__error}>
          {inputPasswordComfirmError}
        </div>
      </div>
      <div>
        <input
          className={styles.reset__form__submit}
          type="submit"
          value="Réinitialiser"
        />
        <div className={styles.reset__form__input__error}></div>
      </div>
    </form>
  );
};

export default Reset;
