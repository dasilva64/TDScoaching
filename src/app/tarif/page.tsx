import WhileInView from "../components/framer/WhileInView";
import styles from "./page.module.scss";
import Image from "next/image";

const Tarif = () => {
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
      <main className={styles.tarif}>
        <section className={styles.tarif__bg}>
          <Image
            className={styles.tarif__bg__img}
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            src={"/assets/img/avenue.jpg"}
            alt="bousole"
          />
        </section>
        <section className={styles.tarif__main}>
          <h1 className={styles.tarif__main__h1}>Tarif / Durée</h1>
          <div className={styles.tarif__main__container}>
            <div className={styles.test}>
              <div className={styles.test__ok}>pack découverte</div>
            </div>
          </div>
        </section>
        <h1 className={styles.tarif__h1}>Tarif / Durée</h1>
        <div className={styles.tarif__container}>
          <div className={styles.tarif__article}>
            <ul className={styles.tarif__article__ul}>
              <li>
                Conditions de paiement : en fin de séance par chèque ou carte
                bancaire
              </li>
              <li>Séance découverte : 50 € (durée 30 à 45 mn)</li>
              <li>Séances coaching : 80 € (durée 1 heure)</li>
            </ul>
            <h2 className={styles.tarif__article__h2}>
              Offres de tarifs en packs
            </h2>
            <div className={styles.tarif__article__flex}>
              <div>
                <p className={styles.tarif__article__flex__div__p}>
                  Problématiques dites « simples »<br />
                  Séance découverte + Pack 5 séances
                  <br />
                  3 mois d’accompagnement
                  <br />
                  380 euros
                </p>
              </div>
              <div>
                <p className={styles.tarif__article__flex__div__p}>
                  Coaching classNameique
                  <br />
                  Séance découverte + Pack 10 séances
                  <br />
                  6 mois d’accompagnement
                  <br />
                  730 euros
                </p>
              </div>
            </div>
            <div>
              <h2 className={styles.tarif__article__h2}>Durée :</h2>

              <ul className={styles.tarif__article__ul}>
                <li>
                  Coaching classique : 10 à 12 séances étalées sur 5 à 12 mois
                </li>
                <li>
                  Pour des problématiques « simples » : 5 / 6 séances étalées
                  sur 2 à 3 mois
                </li>
                <li>Les séances sont espacées de 2 semaines</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Tarif;
