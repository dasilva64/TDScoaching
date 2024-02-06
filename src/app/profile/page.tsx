import React from "react";
import styles from "./page.module.scss";
import DeleteAccount from "./components/deleteAccount/DeleteAccount";
import FirstnameData from "./components/firstnameData/FirstnameData";
import PasswordData from "./components/passwordData/PasswordData";
import LastnameData from "./components/lastnameData/LastnameData";
import EmailSendTokenData from "./components/emailSendTokenData/EmailSendTokenData";
import WhileInView from "../components/framer/WhileInView";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "../../../lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import localFont from "next/font/local";
import NoScript from "../components/noscript/NoScript";
const Parisienne = localFont({
  src: "../Parisienne-Regular.ttf",
  display: "swap",
});

async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

const Profile = async () => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }
  return (
    <>
      <NoScript />

      <main className={styles.profile}>
        <section className={styles.profile__main}>
          <h1 className={`${styles.profile__main__h1} ${Parisienne.className}`}>
            Profile
          </h1>
          <div className={styles.profile__main__container}>
            <WhileInView type="x">
              <div className={styles.profile__main__container__content}>
                <h3
                  className={`${styles.profile__main__container__content__h3} ${Parisienne.className}`}
                >
                  Identité
                </h3>
                <FirstnameData />
                <LastnameData />
              </div>
            </WhileInView>
            <WhileInView type="x">
              <div className={styles.profile__main__container__content}>
                <h3
                  className={`${styles.profile__main__container__content__h3} ${Parisienne.className}`}
                >
                  Connexion
                </h3>
                <PasswordData />
                <EmailSendTokenData />
              </div>
            </WhileInView>
            {/* <WhileInView type="x">
              <div className={styles.profile__main__container__content}>
                <h3 className={styles.profile__main__container__content__h3}>
                  Sécurité
                </h3>
                <TwoFactorSendTokenData />
              </div>
            </WhileInView> */}
            <WhileInView type="x">
              <div className={styles.profile__main__container__content}>
                <h3
                  className={`${styles.profile__main__container__content__h3} ${Parisienne.className}`}
                >
                  Suppression
                </h3>
                <DeleteAccount />
              </div>
            </WhileInView>
          </div>
        </section>
      </main>
    </>
  );
};

export default Profile;
