"use client";

import React from "react";
import styles from "./DeleteAccount.module.scss";
import { useDispatch } from "react-redux";
import Image from "next/image";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  return (
    <>
      <div
        className={styles.card}
        onClick={() => {
          dispatch({
            type: "ModalDeleteAccount/open",
          });
        }}
      >
        <>
          <Image
            className={styles.card__icone}
            width="20"
            height="20"
            priority={true}
            src={"/assets/icone/trash-can-solid.svg"}
            alt="bousole"
          />
          <div className={styles.card__info}>
            <p>
              <strong>Suppression du compte</strong>
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
        </>
      </div>
    </>
  );
};

export default DeleteAccount;
