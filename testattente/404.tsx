import Link from "next/link";
import Layout from "../components/layout/Layout";
import styles from "./index.module.scss";

export default function Custom404() {
  return (
    <>
      <Layout>
        <main className={styles.home}>
          <h1 className={styles.home__h1}>Cette pas n'existe pas</h1>
          <div className={styles.home__container}>
            <div className={styles.home__article}>
              <div className={styles.home__back}>
                <Link className={styles.home__back__btn} href={"/login"}>
                  Retour à la page de connection
                </Link>
                <Link
                  className={`${styles.home__back__btn} ${styles.home__back__btn__margin}`}
                  href={"/"}
                >
                  Retour à la page d'accueil
                </Link>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
