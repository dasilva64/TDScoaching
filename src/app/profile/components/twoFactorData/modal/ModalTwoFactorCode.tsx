import React from "react";
import styles from "./ModalTwoFactorCode.module.scss";
import { TextField } from "@mui/material";

const ModalTwoFactorCode = () => {
  const closeForm = () => {};
  return (
    <>
      <div className={styles.bg}></div>
      <div className={styles.modalTwoFactor}>
        <button
          className={styles.modalTwoFactor__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalTwoFactor__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalTwoFactor__h1}>
          Modifier l&apos;authentification à deux facteurs
        </h1>
        <form>
          <TextField
            value={""}
            style={{ margin: "20px 0px 0px 0px" }}
            id={"firstname"}
            label={"Prénom"}
            variant="standard"
            type={"text"}
            placeholder={"Entrez votre prénom"}
            FormHelperTextProps={{ style: { color: "red" } }}
            onChange={(e) => {
              /* handlerInput(
                e,
                "firstname",
                /^[A-Za-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi ]{3,}$/,
                setValidFirstnameInput,
                setErrorMessageFirstname,
                setFirstnameInput,
                "Prénom : 3 lettres minimum"
              ); */
            }}
            helperText={""}
          />
          <div className={styles.modalEditMainUserData__form__submit}>
            <input
              className={styles.modalEditMainUserData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalTwoFactorCode;
