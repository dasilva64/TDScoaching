"use client";

import React from "react";
import styles from "./TwoFAData.module.scss"
import Image from "@/app/components/image/Image";

const TwoFADataLoad = () => {
    return (
    <>
      <button
        className={`${styles.card__load} modalOpen`}
        tabIndex={0}
        disabled={true}
      >
        <Image
          className={styles.card__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/user-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__info}>
          <p className={styles.card__info__name}>
            <strong>Double authentification</strong>
          </p>
          <p data-text={"Chargement..."} className={styles.card__info__p}>
            {"Chargement..."}
          </p>
        </div>
        <Image
          className={styles.card__info__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/chevron-right-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__load__arc}>
          <div className={styles.card__load__arc__circle}></div>
        </div>
      </button>
    </>
  );
}

export default TwoFADataLoad