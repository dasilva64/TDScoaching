import React from "react";
import styles from "../page.module.scss";
import EmailData from "./emailSendTokenData/EmailSendTokenData";
import MainData from "./mainData/MainData";
import MeetingData from "./meetingData/MeetingData";
import PasswordData from "./passwordData/PasswordData";
import PhoneData from "./phoneSendTokenData/PhoneSendTokenData";
import TwoFactorData from "./twoFactorData/TwoFactorData";
import DeleteAccount from "./deleteAccount/DeleteAccount";

const Display = () => {
  return (
    <>
      <>
        <h2 className={styles.profile__article__h2}>Mes informations</h2>
        <div className={styles.profile__article__div}>
          <div className={styles.profile__article__div__div}>
            <MainData />
            <PasswordData />
            <EmailData />
          </div>

          <div
            className={`${styles.profile__article__div__div} ${styles.profile__article__div__div__margin}`}
          >
            <PhoneData />
            <MeetingData />
            <TwoFactorData />
          </div>
        </div>
        <DeleteAccount />
      </>
    </>
  );
};

export default Display;
