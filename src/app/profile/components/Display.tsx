"use client";
import React from "react";
import styles from "../page.module.scss";
import EmailData from "./emailSendTokenData/EmailSendTokenData";
import MainData from "./mainData/MainData";
import MeetingData from "./meetingData/MeetingData";
import PasswordData from "./passwordData/PasswordData";
import PhoneData from "./phoneData/PhoneData";
import TwoFactorData from "./twoFactorData/TwoFactorData";
import EmailCheck from "./emailData/EmailData";
import useUser from "@/app/components/hook/useUser";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";

const Display = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);
  return (
    <>
      {isLog === true && (
        <>
          <EmailCheck />
          <h2 className={styles.profile__article__h2}>Mes informations</h2>
          <div className={styles.profile__article__div}>
            <div className={styles.profile__article__div__div}>
              <MainData />
              <PasswordData />
              <EmailData />
            </div>

            <div className={styles.profile__article__div__div}>
              <PhoneData />
              <MeetingData />
              <TwoFactorData />
            </div>
          </div>
        </>
      )}
      {isLog === false && (
        <h2 className={styles.profile__article__h2}>Vous n'avez pas accès à cette page, vous allez être redirigé</h2>
      )}
    </>
  );
};

export default Display;
