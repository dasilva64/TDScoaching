"use client";

import React, { useEffect } from "react";
import styles from "./Content.module.scss";
import NoScript from "@/app/components/noscript/NoScript";
import DeleteAccount from "../deleteAccount/DeleteAccount";
import EmailSendTokenData from "../emailSendTokenData/EmailSendTokenData";
import FirstnameData from "../firstnameData/FirstnameData";
import ModalUserFirstnameData from "../firstnameData/modal/ModalUserFirstnameData";
import LastnameData from "../lastnameData/LastnameData";
import ModalUserLastnameData from "../lastnameData/modal/ModalUserLastnameData";
import PasswordData from "../passwordData/PasswordData";
import localFont from "next/font/local";
import useGet from "@/app/components/hook/useGet";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ModalUserPasswordData from "../passwordData/modal/ModalUserPasswordData";
import ModalUserSendToken from "../emailSendTokenData/modal/ModalUserSendToken";
import EmailCheck from "../emailData/EmailData";
import ModalCloseEmail from "../emailData/modal/ModalCloseEmail";
import ModalDeleteAccount from "../deleteAccount/modal/ModalDeleteAccount";
import LastnameDataLoad from "../lastnameData/LastnameDataLoad";
import FirstnameDataLoad from "../firstnameData/FirstnameDataLoad";
import EmailDataLoad from "../emailSendTokenData/EmailSendTokenDataLoad";
import TwoFADataLoad from "../twoFAData/TwoFADataLoad";
import TwoFAData from "../twoFAData/TwoFAData";
import ModalTwoFADesactivation from "../twoFAData/modal/desactivation/ModalTwoFADesactivation";
import ModalTwoFAActivation from "../twoFAData/modal/activation/ModalTwoFAActivation";
import { mutate as globalMutate } from "swr";
import ModalTwoFAActivationCancel from "../twoFAData/modal/activation/cancel/ModalTwoFAActivationCancel";
import FirstnameDataError from "../firstnameData/FirstnameDataError";
import LastnameDataError from "../lastnameData/LastnameDataError";
import EmailSendTokenDataError from "../emailSendTokenData/EmailSendTokenDataError";
import TwoFADataError from "../twoFAData/TwoFADataError";
const Parisienne = localFont({
  src: "../../../parisienne-regular-webfont.woff2",
  display: "swap",
});

const Content = () => {
  const { data, isLoading, isError, mutate } = useGet(
    "/profile/components/api"
  );
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (isError) {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: {
          type: "error",
          flashMessage: "Erreur lors du chargement, veuillez réessayer",
        },
      });
    }
    if (isLoading === false && data) {
      if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=profile`);
      } else if (data.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
      } else if (data.status === 200) {
        dispatch({
          type: "ModalSendTokenEmail/edit",
          payload: {inputEmail: data.body.email}
        })
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
      }
    }
  }, [data, dispatch, isError, isLoading, router]);
  
  return (
    <>
      <NoScript />
      {isLoading === false && data && data.status === 200 && data.body && (
        <>
        
          <ModalUserFirstnameData data={data} mutate={mutate} />
           <ModalUserLastnameData data={data} mutate={mutate} />
          <ModalUserPasswordData mutate={mutate} />
          <ModalUserSendToken data={data} mutate={mutate} />
          <ModalDeleteAccount mutate={mutate} />
          <ModalTwoFADesactivation mutate={mutate} data={data} />
          <ModalTwoFAActivation mutate={mutate} data={data} />
          <ModalTwoFAActivationCancel />
          {data.body.newEmail && (
            <>
              <EmailCheck data={data} mutate={mutate} />
              <ModalCloseEmail mutate={mutate} />
            </>
          )}
        </>
      )}
      
      <main className={styles.profile}>
        <section className={styles.profile__main}>
          <h1 className={`${styles.profile__main__h1} ${Parisienne.className}`}>
            Profile
          </h1>
          <div className={styles.profile__main__container}>
            <div className={styles.profile__main__container__content}>
              <h3
                className={`${styles.profile__main__container__content__h3} ${Parisienne.className}`}
              >
                Identité
              </h3>
              {data && data.status === 200 && data.body && isLoading === false && (
                <>
                  <FirstnameData data={data && data.body && data} />
                  <LastnameData data={data && data.body && data} />
                </>
              )}
              {data && data.status === 429 && isLoading === false && (
                <>
                  <FirstnameDataError />
                  <LastnameDataError />
                </>
              )}
              {isLoading === true && (
                <>
                  <FirstnameDataLoad />
                  <LastnameDataLoad />
                </>
              )}
            </div>
            <div className={styles.profile__main__container__content}>
              <h3
                className={`${styles.profile__main__container__content__h3} ${Parisienne.className}`}
              >
                Connexion
              </h3>
               <PasswordData />
              {data && data.body && isLoading === false && (
                <EmailSendTokenData data={data && data.body && data} />
              )}
              {data && data.status === 429 && isLoading === false && (
                <>
                  <EmailSendTokenDataError />
                </>
              )}
              {isLoading === true && (
                <>
                  <EmailDataLoad />
                </>
              )}
              {data && data.body && isLoading === false && (
                <TwoFAData data={data && data.body && data} />
              )}
               {data && data.status === 429 && isLoading === false && (
                <>
                  <TwoFADataError />
                </>
              )}
              {isLoading === true && (
                <>
                  <TwoFADataLoad />
                </>
              )}
            </div>
            <div className={styles.profile__main__container__content}>
              <h3
                className={`${styles.profile__main__container__content__h3} ${Parisienne.className}`}
              >
                Suppression
              </h3>
              <DeleteAccount />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Content;
