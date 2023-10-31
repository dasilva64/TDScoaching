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
        <section className={styles.tarif__packs}>
          <h1 className={styles.tarif__packs__h1}>Offres packs</h1>
          <div className={styles.tarif__packs__container}>
            <div className={styles.tarif__packs__container__card}>
              <h3 className={styles.tarif__packs__container__card__h3}>
                Pack coaching unique
              </h3>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li>1 entretien découverte offert</li>
                <li>1 séances de coaching</li>
                <li>1 bilan final offert</li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                100 euros
              </p>
            </div>
            <div className={styles.tarif__packs__container__card}>
              <h3 className={styles.tarif__packs__container__card__h3}>
                Pack coaching flash
              </h3>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li>1 entretien découverte offert</li>
                <li>3 séances de coaching</li>
                <li>1 bilan final offert</li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                300 euros
              </p>
            </div>
            <div className={styles.tarif__packs__container__card}>
              <h3 className={styles.tarif__packs__container__card__h3}>
                Pack coaching long
              </h3>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li>1 entretien découverte offert</li>
                <li>10 séances de coaching</li>
                <li>1 point d’étape offert (Après séance 5)</li>
                <li>1 bilan final offert</li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                1 000 euros
              </p>
            </div>
            <div className={styles.tarif__packs__container__card}>
              <h3 className={styles.tarif__packs__container__card__h3}>
                Pack coaching full time
              </h3>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li>1 entretien découverte offert</li>
                <li>20 séances de coaching</li>
                <li>2 points d’étape offerts (Après séances 7 et 14)</li>
                <li>1 bilan final offert</li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                2 000 euros
              </p>
            </div>
          </div>
        </section>

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
