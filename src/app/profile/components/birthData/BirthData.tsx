"use client";

import React from "react";
import styles from "./BirthData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import Image from "next/image";

const BirthData = () => {
  const { userData, isLoading, isError } = useUserGet();
  const dispatch = useDispatch<AppDispatch>();
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
            <strong>Date de naissance</strong>
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
                type: "form/openModalEditBirthUserData",
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
                <strong>Date de naissance</strong>
              </p>
              <p>{userData?.body.birth}</p>
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

export default BirthData;
