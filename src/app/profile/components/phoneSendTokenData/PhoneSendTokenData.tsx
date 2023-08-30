"use client";

import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PhoneSendTokenData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";

const PhoneData = () => {
  const dispatch = useDispatch();
  const { userData, isLoading, isError } = useUserGet();
  let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
      <div className={styles.card}>
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
            <strong>Numéro de téléphone</strong>
          </p>
          <p>Chargement des données</p>
        </div>
        <Image
          className={styles.card__info__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/chevron-right-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__arc}>
          <div className={styles.card__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (userData) {
      content = (
        <>
          <div
            className={styles.card}
            onClick={() => {
              dispatch({
                type: "form/openModalEditPhoneSendData",
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
                <strong>Numéro de téléphone</strong>
              </p>
              <p>{userData?.body.phone}</p>
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
    }
  }

  return <>{content}</>;
};

export default PhoneData;
