"use client";

import { AppDispatch } from "../../../redux/store";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./EmailSendTokenData.module.scss";
import Image from "next/image";
import useGet from "@/app/components/hook/useGet";
import { useRouter } from "next/navigation";

const EmailData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserProfile");

  let content;
  if (isError) {
    dispatch({
      type: "flash/storeFlashMessage",
      payload: {
        type: "error",
        flashMessage: "Erreur lors du chargement, veuillez réessayer",
      },
    });
    content = (
      <>
        <div className={styles.card__load}>
          <Image
            className={styles.card__load__icone}
            width="20"
            height="20"
            priority={true}
            src={"/assets/icone/user-solid.svg"}
            alt="bousole"
          />
          <div className={styles.card__load__info}>
            <p>
              <strong>Email</strong>
            </p>
            <p className={styles.card__load__info__p__error}>
              Erreur de chargement
            </p>
          </div>
          <Image
            className={styles.card__load__info__icone}
            width="20"
            height="20"
            priority={true}
            src={"/assets/icone/chevron-right-solid.svg"}
            alt="bousole"
          />
        </div>
      </>
    );
  } else if (isLoading) {
    content = (
      <div className={styles.card__load}>
        <Image
          className={styles.card__load__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/envelope-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__load__info}>
          <p>
            <strong>Email</strong>
          </p>
          <p className={styles.card__load__info__p}>Chargement des données</p>
        </div>
        <Image
          className={styles.card__load__info__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/chevron-right-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__load__arc}>
          <div className={styles.card__load__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (userData.status === 200) {
      content = (
        <>
          <div
            className={styles.card}
            onClick={() => {
              dispatch({
                type: "ModalSendTokenEmail/open",
              });
            }}
          >
            <Image
              className={styles.card__icone}
              width="20"
              height="20"
              priority={true}
              src={"/assets/icone/envelope-solid.svg"}
              alt="bousole"
            />
            <div className={styles.card__info}>
              <p>
                <strong>Email</strong>
              </p>
              <p className={styles.card__info__p}>{userData?.body.email}</p>
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
    } else if (userData.status === 401) {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: {
          type: "error",
          flashMessage: userData.message,
        },
      });
      router.push("/");
    } else {
      setTimeout(() => {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: userData.message,
          },
        });
      }, 2000);
      router.refresh();
    }
  }
  return <>{content}</>;
};

export default EmailData;
