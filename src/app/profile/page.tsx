import React from "react";
import styles from "./page.module.scss";
import DeleteAccount from "./components/deleteAccount/DeleteAccount";
import EmailData from "./components/emailData/EmailData";
import FirstnameData from "./components/firstnameData/FirstnameData";
import MeetingData from "./components/meetingData/MeetingData";
import PasswordData from "./components/passwordData/PasswordData";
import PhoneData from "./components/phoneData/PhoneData";
import TwoFactorData from "./components/twoFactorData/TwoFactorData";
import LastnameData from "./components/lastnameData/LastnameData";
import BirthData from "./components/birthData/BirthData";
import GenderData from "./components/genderData/GenderData";
import EmailSendTokenData from "./components/emailSendTokenData/EmailSendTokenData";
import PhoneSendTokenData from "./components/phoneSendTokenData/PhoneSendTokenData";

const Profile = async () => {
  return (
    <>
      <noscript
        style={{
          width: "100%",
          padding: "20px 0",
          background: "red",
          position: "fixed",
          bottom: "0",
          left: "0",
          zIndex: "999",
          color: "white",
          textAlign: "center",
        }}
      >
        Veuillez activer JavaScript pour profiter pleinement de notre site.
      </noscript>
      <main className={styles.profile}>
        <section className={styles.profile__main}>
          <h1 className={styles.profile__main__h1}>Profile</h1>
          <div className={styles.profile__main__container}>
            <div className={styles.profile__main__container__content}>
              <h3 className={styles.profile__main__container__content__h3}>
                Identité
              </h3>
              <FirstnameData />
              <LastnameData />
              <BirthData />
              <GenderData />
            </div>
            <div className={styles.profile__main__container__content}>
              <h3 className={styles.profile__main__container__content__h3}>
                Connexion
              </h3>
              <PasswordData />
              <EmailSendTokenData />
            </div>
            <div className={styles.profile__main__container__content}>
              <h3 className={styles.profile__main__container__content__h3}>
                Sécurité
              </h3>
              <PhoneSendTokenData />
              <TwoFactorData />
            </div>
            <div className={styles.profile__main__container__content}>
              <h3 className={styles.profile__main__container__content__h3}>
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

export default Profile;
