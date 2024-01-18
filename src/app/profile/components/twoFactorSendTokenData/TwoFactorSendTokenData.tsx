"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./TwoFactorSendTokenData.module.scss";
import Image from "next/image";
import useGet from "../../../components/hook/useGet";
import { useRouter } from "next/navigation";

const TwoFactorSendTokenData = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/profile/components/api");
  let restDate;
  if (userData?.body.twoFactorCode) {
    let limitDate = userData?.body.twoFactorCode.limitDate;
    let convertInDate = new Date(limitDate);
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());

    restDate = new Date(difference);
  }

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
              <strong>Double authentification</strong>
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
          src={"/assets/icone/shield-halved-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__load__info}>
          <p className={styles.card__load__info__load__p}>
            <strong>Double authentification</strong>
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
                type: "ModalSendTokenTwoFactor/open",
              });
            }}
          >
            <Image
              className={styles.card__icone}
              width="20"
              height="20"
              priority={true}
              src={"/assets/icone/shield-halved-solid.svg"}
              alt="bousole"
            />
            <div className={styles.card__info}>
              <p>
                <strong>Double authentification</strong>
              </p>
              <p>
                {userData?.body.twoFactor === true ? "Activé" : "Désactivé"}
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

export default TwoFactorSendTokenData;
