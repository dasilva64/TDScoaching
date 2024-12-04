import React from "react";
import styles from "./NoScript.module.scss";

const NoScript = () => {
  return (
    <>
      <noscript className={styles.noscript}>
        Veuillez activer JavaScript pour profiter pleinement de notre site.
      </noscript>
    </>
  );
};

export default NoScript;
