import React from "react";
import Content from "./components/Content";
import styles from "./page.module.scss";
import NoScript from "@/app/components/noscript/NoScript";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import localFont from "next/font/local";
import { SessionData, sessionOptions } from "../../../../lib/session";
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
  } else {
    if (session.role !== "ROLE_ADMIN") {
      redirect("/");
    }
  }
  return (
    <>
      <NoScript />

      <main className={styles.user}>
        <h1 className={`${styles.user__h1} ${Parisienne.className}`}>
          Donnée d&apos;un utilisateur
        </h1>
        <div className={styles.user__container}>
          <Content />
        </div>
      </main>
    </>
  );
};

export default page;
