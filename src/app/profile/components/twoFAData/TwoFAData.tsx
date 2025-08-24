"use client";

import React, { useEffect, useState } from "react";
import styles from "./TwoFAData.module.scss"
import { useDispatch, useSelector } from "react-redux";
import Image from "@/app/components/image/Image";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { useRouter } from "next/navigation";
import { mutate as globalMutate } from "swr";
import { RootState } from "@/app/redux/store/store";

const TwoFAData = ({ data: userData }: any) => {
  const dispatch = useDispatch();
 const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/twoFAData/api",
    fetchPost
  );
  const router = useRouter()
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        if (data.twoFaCheck === false) {
          dispatch({
            type: "ModalTwoFADesactivation/open"
        })
        } else {
          dispatch({
            type: "ModalTwoFAActivation/open"
        })
        }
        reset();
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=profile`);
      }  else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [
    data,
    dispatch,
    isMutating,
    reset,
    router,
    userData,
  ]);
  const handleChange = (e: any) => {
     if (e.target.checked !== false || e.target.checked !== true) {
          trigger({twoFaCheck: e.target.checked , csrfToken: csrfToken})

      }

  }
  return (
    <>
      <button
        className={`${styles.card} modalOpen`}
        tabIndex={0}
      >
        <Image
          className={styles.card__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/2fa.png"}
          alt="bousole"
        />
        <div className={styles.card__info}>
          <p className={styles.card__info__name}>
            <strong>Double authentification</strong>
          </p>
          <div className={styles.card__info__switch}>
            <p>Désactivé</p>
            <label className={styles.card__info__switch__input}>
              <input type="checkbox" checked={userData.body.isTwoFactorEnabled} onChange={handleChange} />
              <span></span>
            </label>
            <p>Activé</p>
          </div>

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
}

export default TwoFAData