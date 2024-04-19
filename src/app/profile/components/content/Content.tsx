"use client";

import React from "react";
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
import { AppDispatch } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import ModalUserPasswordData from "../passwordData/modal/ModalUserPasswordData";
import ModalUserSendToken from "../emailSendTokenData/modal/ModalUserSendToken";
import EmailCheck from "../emailData/EmailData";
import ModalCloseEmail from "../emailData/modal/ModalCloseEmail";
const Parisienne = localFont({
  src: "../../../Parisienne-Regular.ttf",
  display: "swap",
});

const Content = () => {
  const { data, isLoading, isError, mutate } = useGet(
    "/profile/components/api"
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
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
      router.push("/");
    } else if (data.status === 400) {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: {
          type: "error",
          flashMessage: data.message,
        },
      });
      router.push("/");
    }
  }
  return (
    <>
      <NoScript />
      {isLoading === false && data.body && (
        <>
          <ModalUserFirstnameData data={data} mutate={mutate} />
          <ModalUserLastnameData data={data} mutate={mutate} />
          <ModalUserPasswordData />
          <ModalUserSendToken data={data} mutate={mutate} />
          {data.body.newEmail && (
            <>
              <EmailCheck data={data} mutate={mutate} />
              <ModalCloseEmail />
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
              <FirstnameData
                isLoading={isLoading && isLoading}
                data={data && data}
              />
              <LastnameData
                isLoading={isLoading && isLoading}
                data={data && data}
              />
            </div>
            <div className={styles.profile__main__container__content}>
              <h3
                className={`${styles.profile__main__container__content__h3} ${Parisienne.className}`}
              >
                Connexion
              </h3>
              <PasswordData />
              <EmailSendTokenData
                isLoading={isLoading && isLoading}
                data={data && data}
              />
            </div>
            {/* <WhileInView type="x">
              <div className={styles.profile__main__container__content}>
                <h3 className={styles.profile__main__container__content__h3}>
                  Sécurité
                </h3>
                <TwoFactorSendTokenData />
              </div>
            </WhileInView> */}
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
