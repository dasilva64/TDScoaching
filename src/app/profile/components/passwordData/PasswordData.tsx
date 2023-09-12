"use client";

import { AppDispatch } from "../../../redux/store";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./PasswordData.module.scss";
import Image from "next/image";

const PasswordData = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div
        className={styles.card}
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
          src={"/assets/icone/user-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__info}>
          <p>
            <strong>Mot de passe</strong>
          </p>
          <p>{"*".toString().repeat(6)}</p>
        </div>
        <Image
          className={styles.card__info__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/chevron-right-solid.svg"}
          alt="bousole"
        />
      </div>
    </>
  );
};

export default PasswordData;
