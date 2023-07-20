import styles from "./page.module.scss";
import Display from "./components/Display";

const Page = () => {
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
