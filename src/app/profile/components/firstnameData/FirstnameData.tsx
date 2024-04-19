"use client";

import React, { useEffect, useRef } from "react";
import styles from "./FirstnameData.module.scss";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { AppDispatch } from "@/app/redux/store";

const FirstnameData = ({ isLoading, data }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <button
        className={`${isLoading ? styles.card__load : styles.card} modalOpen`}
        tabIndex={0}
        disabled={isLoading}
        onClick={() => {
          if (data) {
            dispatch({
              type: "ModalEditFirstname/open",
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
            <strong>Prénom</strong>
          </p>
          <p className={styles.card__info__p}>
            {isLoading ? "Chargement des données" : data.body.firstname}
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

export default FirstnameData;
