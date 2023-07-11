import styles from "./index.module.scss";
import Layout from "../../components/layout/Layout";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Display from "./components/Display";
import Link from "next/link";

const Profile = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "loading") {
    content = <h2 className={styles.profile__h2}>Loading...</h2>;
  } else if (status === "unauthenticated") {
    content = (
      <>
        <h2 className={styles.profile__h2}>Vous n'avez pas accès à cette page</h2>
        <div className={styles.profile__back}>
          <Link className={styles.profile__back__btn} href={"/login"}>Retour à la page de connection</Link>
          <Link className={`${styles.profile__back__btn} ${styles.profile__back__btn__margin}`} href={"/"}>Retour à la page d'accueil</Link>
        </div>
        
      </>
    );
  } else if (status === "authenticated") {
    content = <Display />;
  }
  return (
    <Layout>
      <main className={styles.profile}>
        <h1 className={styles.profile__h1}>Profile</h1>
        <div className={styles.profile__container}>
          <div className={styles.profile__article}>{content}</div>
        </div>
      </main>
    </Layout>
  );
};

export default Profile;
