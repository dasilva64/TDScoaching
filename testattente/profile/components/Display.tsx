import React from "react";
import styles from "../index.module.scss";
import EmailData from "./emailSendTokenData/EmailSendTokenData";
import MainData from "./mainData/MainData";
import MeetingData from "./meetingData/MeetingData";
import PasswordData from "./passwordData/PasswordData";
import PhoneData from "./phoneData/PhoneData";
import TwoFactorData from "./twoFactorData/TwoFactorData";
import EmailCheck from "./emailData/EmailData";
import useUser from "../../../components/hook/useUser";

const Display = () => {
  return (
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
  );
};

export default Display;
