"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./TwoFactorSendTokenData.module.scss";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import Image from "next/image";
import fetchGet from "@/app/components/fetch/fetchGet";
import useGet from "@/app/components/hook/useGet";

const TwoFactorSendTokenData = () => {
  const dispatch = useDispatch();
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserProfile");
  let restDate;
  if (userData?.body.twoFactorCode) {
    let limitDate = userData?.body.twoFactorCode.limitDate;
    let convertInDate = new Date(limitDate);
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());

    restDate = new Date(difference);
  }
  const { data, trigger } = useSWRMutation(
    "/api/user/sendTokenTwoFactor",
    fetchGet
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    const mutateTwoFactor = async () => {
      let copyTwoFactorCode = userData?.body.twoFactorCode;
      mutate(
        "/api/user/getUserProfile",
        {
          ...data,
          body: {
            ...data.body,
            twoFactor: false,
            TwoFactorCode: copyTwoFactorCode,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.status === 200) {
      mutateTwoFactor();
    }
  }, [data, userData?.body.twoFactorCode]);
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
          <p className={styles.card__info__load__p}>
            <strong>Double authentification</strong>
          </p>
          <p className={styles.card__info__p}>Chargement des données</p>
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
                type: "ModalSendTokenTwoFactor/open",
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
    }
  }
  return <>{content}</>;
};

export default TwoFactorSendTokenData;