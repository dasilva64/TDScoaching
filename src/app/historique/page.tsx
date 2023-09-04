import AllMeeting from "./components/AllMeeting";
import styles from "./page.module.scss";

export default function Historique() {
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
      <main className={styles.historique}>
        <h1 className={styles.historique__h1}>
          Historique de tous les rendez-vous
        </h1>
        <div className={styles.historique__container}>
          <div className={styles.historique__article}>
            <h2 className={styles.historique__article__h2}>
              Vous êtes en quête de bien-être ? Le coaching de vie peut vous
              apporter des solutions.
            </h2>
            <div>
              <AllMeeting />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
