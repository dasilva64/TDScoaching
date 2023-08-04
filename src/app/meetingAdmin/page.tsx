import styles from "./page.module.scss";
import Display from "./components/Display";
import { cookies } from "next/headers";
import { getRequestCookie } from "../../../lib/getRequestCookie";

const Page = async () => {
  return (
    <>
      <main className={styles.meet}>
        <h1 className={styles.meet__h1}>Tous les rendez-vous</h1>
        <div className={styles.meet__container}>
          <Display />
        </div>
      </main>
    </>
  );
};

export default Page;
