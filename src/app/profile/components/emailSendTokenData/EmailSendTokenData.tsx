"use client";

import { AppDispatch } from "../../../redux/store/store";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./EmailSendTokenData.module.scss";
import Image from "@/app/components/image/Image";

const EmailData = ({ data }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <button
        className={`${styles.card} modalOpen`}
        tabIndex={0}
        onClick={() => {
          if (data) {
            dispatch({
              type: "ModalSendTokenEmail/open",
              payload: {inputEmail: data.body.email}
            });
          }
        }}
      >
        <Image
          className={styles.card__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/envelope-at-fill.svg"}
          alt="bousole"
        />
        <div className={styles.card__info}>
          <p className={styles.card__info__name}>
            <strong>Adresse email</strong>
          </p>
          <p className={styles.card__info__p} data-text={data.body.email}>
            {data.body.email}
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

export default EmailData;
