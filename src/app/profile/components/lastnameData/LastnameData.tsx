"use client";

import React from "react";
import styles from "./LastnameData.module.scss";
import Image from "next/image";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";

const LastnameData = ({ isLoading, data }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <button
        tabIndex={0}
        disabled={isLoading}
        className={`${isLoading ? styles.card__load : styles.card} modalOpen`}
        onClick={() => {
          if (data) {
            dispatch({
              type: "ModalEditLastname/open",
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
            <strong>Nom de famille</strong>
          </p>
          <p className={styles.card__info__p}>
            {isLoading ? "Chargement des données" : data.body.lastname}
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

export default LastnameData;
