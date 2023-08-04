import React from "react";
import { cookies } from "next/headers";
import styles from "./page.module.scss";
import Display from "./components/Display";
import { getRequestCookie } from "../../../lib/getRequestCookie";

const Profile = async () => {
  const user = await getRequestCookie(cookies());
  console.log("second", user);
  return (
    <>
      <main className={styles.profile}>
        <h1 className={styles.profile__h1}>Profile</h1>
        <div className={styles.profile__container}>
          <div className={styles.profile__article}>
            <Display />
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
