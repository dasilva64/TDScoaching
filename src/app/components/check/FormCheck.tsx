import React, { useState } from "react";

import styles from "./FormCheck.module.scss";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";

const FormCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { emailUser } = useSelector((state: RootState) => state.auth);

  const [inputCode, setInputCode] = useState<string>("");
  const handlerInputCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(e.target.value);
  };

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fetchCheckCode = async () => {
      let response = await fetch("http://localhost:8080/user/check", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ code: inputCode, email: emailUser }),
      });
      let json = await response.json();
      console.log(json);
      /* dispatch({
        type: "form/closeCheck",
      }); */
    };
    if (inputCode.length === 6) {
      fetchCheckCode();
    }
  };

  const closeForm = () => {
    dispatch({
      type: "form/toggleLogin",
    });
  };
  return (
    <>
      <div className={styles.check}>
        <button className={styles.check__btn} onClick={() => closeForm()}>
          <span className={styles.check__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.check__h1}>Entrer votre code de vérification</h1>
        <form
          className={styles.check__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <div className={styles.check__form__group}>
            <label className={styles.check__form__group__label} htmlFor="email">
              Code de validation
            </label>
            <input
              onChange={(e) => {
                handlerInputCode(e);
              }}
              className={styles.check__form__group__input}
              type="text"
              name="code"
              id="code"
            />
            <div className={styles.check__form__group__error}></div>
          </div>
          <div>
            <input type="submit" value="Verifier" />
          </div>
          <div className={styles.check__form__errors}>{}</div>
        </form>
      </div>
    </>
  );
};

export default FormCheck;
