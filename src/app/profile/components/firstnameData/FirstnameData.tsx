"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./FirstnameData.module.scss";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { AppDispatch } from "@/app/redux/store";

const FirstnameData = ({ data }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <button
        className={`${styles.card} modalOpen`}
        tabIndex={0}
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
          <p data-text={data.body.firstname} className={styles.card__info__p}>
            {data.body.firstname}
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
      </button>
    </>
  );
};

export default FirstnameData;
