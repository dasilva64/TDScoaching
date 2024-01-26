import React from "react";
import styles from "./page.module.scss";
import AllUser from "./components/AllUser";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionData, sessionOptions } from "../../../lib/session";
import NoScript from "../components/noscript/NoScript";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../Parisienne-Regular.ttf",
  display: "swap",
});

async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

const page = async () => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  } else {
    if (session.role !== "ROLE_ADMIN") {
      redirect("/");
    }
  }
  return (
    <>
      <NoScript />

      <main className={styles.allUser}>
        <h1 className={`${styles.allUser__h1} ${Parisienne.className}`}>
          Tous les utilisateurs
        </h1>
        <div className={styles.allUser__container}>
          <div className={styles.allUser__article}>
            <div>
              <AllUser />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
