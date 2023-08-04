import React from "react";
import styles from "./page.module.scss";
import Display from "./components/Display";

const Profile = async () => {
  return (
    <>
      <main className={styles.profile}>
        <h1 className={styles.profile__h1}>Profile</h1>
        <div className={styles.profile__container}>
          <div className={styles.profile__article}>{/* <Display /> */}</div>
        </div>
      </main>
    </>
  );
};

export default Profile;
