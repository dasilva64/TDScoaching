import React from "react";
import styles from "./page.module.scss";
import Display from "./components/Display";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
const page = async () => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }
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
      <main className={styles.delete}>
        <h1 className={styles.delete__h1}>
          En attente de suppression du compte
        </h1>
        <div className={styles.delete__container}>
          <Display />
        </div>
      </main>
    </>
  );
};

export default page;
