import React from "react";
import styles from "../login/formLogin.module.scss";

const GroupForm = ({
  nameLabel,
  typeInput,
  nameInput,
  errorMessageInput,
  regex,
  inputValue,
  setInputValue,
  setValidInput,
  errorMessage,
  setErrorMessage,
}: any) => {
  const handlerInput = (e: any) => {
    const mailregex = regex;
    if (mailregex.test(e.target.value)) {
      handler(e, true, "");
    } else if (e.target.value.length === 0) {
      handler(e, false, "");
    } else {
      handler(e, false, errorMessageInput);
    }
  };
  const handler = (
    e: React.ChangeEvent<HTMLInputElement>,
    valid: boolean,
    text: string
  ) => {
    setInputValue(e.target.value);
    setValidInput(valid);
    setErrorMessage(text);
    return valid;
  };

  return (
    <>
      <div className={styles.login__form__group}>
        <label className={styles.login__form__group__label} htmlFor="">
          {nameLabel}
        </label>
        <input
          onChange={(e) => {
            handlerInput(e);
          }}
          className={styles.login__form__group__input}
          type={typeInput}
          name={nameInput}
          id={nameInput}
          value={inputValue}
        />
        <div className={styles.login__form__group__error}>{errorMessage}</div>
      </div>
    </>
  );
};

export default GroupForm;
