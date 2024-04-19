"use client";

import { AppDispatch } from "../../../redux/store";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./EmailSendTokenData.module.scss";
import Image from "next/image";

const EmailData = ({ isLoading, data }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <button
        className={`${styles.card} modalOpen`}
        tabIndex={0}
        disabled={isLoading}
        onClick={() => {
          if (data) {
            dispatch({
              type: "ModalSendTokenEmail/open",
            });
          }
        }}
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
            <strong>Adresse email</strong>
          </p>
          <p className={styles.card__info__p}>
            {isLoading ? "Chargement des données" : data.body.email}
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
        {isLoading && (
          <div className={styles.card__load__arc}>
            <div className={styles.card__load__arc__circle}></div>
          </div>
        )}
      </button>
    </>
  );
};

export default EmailData;
