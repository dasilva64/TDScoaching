import React from "react";
import styles from "./Error.module.scss";

const Error = () => {
  return (
    <>
      <div className={styles.error}>
        <p>Erreur de chargement, veuillez réessayer</p>
      </div>
    </>
  );
};

export default Error;