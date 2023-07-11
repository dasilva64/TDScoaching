import Layout from "../../components/layout/Layout";
import styles from "./index.module.scss";

const Tarif = () => {
  return (
    <Layout>
      <main className={styles.tarif}>
        <h1 className={styles.tarif__h1}>Tarif / Durée</h1>
        <div className={styles.tarif__container}>
          <div className={styles.tarif__article}>
            <div>
              <ul className={styles.tarif__article__ul}>
                <li>
                  Conditions de paiement : en fin de séance par chèque ou carte
                  bancaire
                </li>
                <li>Séance découverte : 50 € (durée 30 à 45 mn)</li>
                <li>Séances coaching : 80 € (durée 1 heure)</li>
              </ul>
            </div>
            <h2 className={styles.tarif__article__h2}>
              Offres de tarifs en packs
            </h2>
            <div className={styles.tarif__article__flex}>
              <div className={styles.tarif__article__flex__div}>
                <p className={styles.tarif__article__flex__div__p}>
                  Problématiques dites « simples »<br />
                  Séance découverte + Pack 5 séances
                  <br />
                  3 mois d’accompagnement
                  <br />
                  380 euros
                </p>
              </div>
              <div className={styles.tarif__article__flex__div}>
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
    </Layout>
  );
};

export default Tarif;
