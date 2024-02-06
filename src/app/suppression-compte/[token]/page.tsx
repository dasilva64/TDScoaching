import React from "react";
import styles from "./page.module.scss";
import Display from "./components/Display";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoScript from "@/app/components/noscript/NoScript";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../Parisienne-Regular.ttf",
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
  }
  return (
    <>
      <NoScript />
      <main className={styles.delete}>
        <h1 className={`${styles.delete__h1} ${Parisienne.className}`}>
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
