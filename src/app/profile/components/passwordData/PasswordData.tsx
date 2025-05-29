"use client";

import { AppDispatch } from "../../../redux/store";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./PasswordData.module.scss";
import Image from "@/app/components/image/Image";

const PasswordData = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <button
        className={`${styles.card} modalOpen`}
        tabIndex={0}
        onClick={() => {
          dispatch({
            type: "ModalEditPassword/open",
          });
        }}
      >
        <Image
          className={styles.card__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/lock-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__info}>
          <p className={styles.card__info__password}>
            <strong>Mot de passe</strong>
          </p>
          <p className={styles.card__info__p}>{"*".toString().repeat(6)}</p>
        </div>
        <Image
          className={styles.card__info__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/chevron-right-solid.svg"}
          alt="bousole"
        />
      </button>
    </>
  );
};

export default PasswordData;
