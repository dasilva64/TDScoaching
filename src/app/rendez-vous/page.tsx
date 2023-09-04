import styles from "./page.module.scss";
import Display from "./components/Display";

const Page = () => {
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
      <main className={styles.meet}>
        <h1 className={styles.meet__h1}>Rendez-vous</h1>
        <div className={styles.meet__container}>
          <Display />
        </div>
      </main>
    </>
  );
};

export default Page;
