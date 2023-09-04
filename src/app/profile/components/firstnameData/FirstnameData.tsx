"use client";

import React from "react";
import styles from "./FirstnameData.module.scss";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { AppDispatch } from "@/app/redux/store";
import useGet from "@/app/components/hook/useGet";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

const FirstnameData = () => {
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserProfile");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  let content;
  if (isError) {
    dispatch({
      type: "flash/storeFlashMessage",
      payload: {
        type: "error",
        flashMessage: "Erreur lors du chargement, veuillez réessayer",
      },
    });
    router.push("/");
  } else if (isLoading) {
    content = (
      <>
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
              <strong>Prénom</strong>
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
      </>
    );
  } else {
    if (userData.status === 200) {
      content = (
        <>
          <div
            className={styles.card}
            onClick={() => {
              dispatch({
                type: "form/openModalEditFirstnameUserData",
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
                <strong>Prénom</strong>
              </p>
              <p>{userData?.body.firstname}</p>
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
    } else {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: { type: "error", flashMessage: userData.message },
      });
      router.push("/");
    }
  }
  return <>{content}</>;
};

export default FirstnameData;
