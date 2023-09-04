"use client";

import React from "react";
import styles from "./LastnameData.module.scss";
import Image from "next/image";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import useGet from "@/app/components/hook/useGet";
import { useRouter } from "next/navigation";

const LastnameData = () => {
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserProfile");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  let content;
  if (isError) {
    content = <div>error</div>;
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
              <strong>Nom de famille</strong>
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
                type: "form/openModalEditLastnameUserData",
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
                <strong>Nom de famille</strong>
              </p>
              <p>{userData?.body.lastname}</p>
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
      router.push("/");
    }
  }
  return <>{content}</>;
};

export default LastnameData;
