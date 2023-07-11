import Image from "next/image";
import styles from "./index.module.scss";
import Link from "next/link";
import Layout from "../../../components/layout/Layout";

const Pro = () => {
  return (
    <Layout>
      <main className={styles.pro}>
        <h1 className={styles.pro__h1}>Vie professionnelle</h1>
        <div className={styles.pro__container}>
          <div className={styles.pro__article}>
            <h2 className={styles.pro__article__h2}>
              Pourquoi faire du coaching professionnel ?
            </h2>
            <div className={styles.pro__article__div}>
              <div className={styles.pro__article__div__text}>
                <ul>
                  <li>
                    Vous êtes confrontés à l’ennui ou à la perte de sens ?
                  </li>
                  <li>
                    Vous souhaitez vous réorienter ou vous envisagez une
                    reconversion professionnelle ?
                  </li>
                  <li>
                    Vous souhaitez développer votre potentiel et vos compétences
                    ?
                  </li>
                </ul>
              </div>
              <div className={styles.pro__article__div__img}>
                <Image
                  src={"/assets/img/laby.jpg"}
                  alt="me"
                  width="64"
                  height="64"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.pro__article}>
            <h2 className={styles.pro__article__h2}>
              Comment tds-coachingdevie peut vous aider ?
            </h2>
            <div className={styles.pro__article__big}>
              <div>
                <p>
                  tds-coachingdevie vous accompagnera afin de vous permettre de
                  :
                </p>
                <ul className={styles.pro__article__big__ul}>
                  <li>Prendre du recul ;</li>
                  <li>Ouvrir le champ des possibles ;</li>
                  <li>Retrouver du sens et booster votre motivation ;</li>
                  <li>
                    Voir plus clairement les options qui s’offrent à vous ;
                  </li>
                  <li>Améliorer votre gestion du temps ;</li>
                  <li>Améliorer votre communication .</li>
                </ul>
              </div>
              <div>
                <p>
                  Je ne ferai pas les choses à votre place. Mon fil conducteur
                  sera toujours de viser votre <strong>autonomie</strong> et
                  votre développement personnel.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.pro__article}>
            <p className={styles.pro__article__p__margin}>
              Si vous souhaitez en savoir plus sur la tarification, cliquez sur
              le bouton ci-dessous.
            </p>
            <p
              className={`${styles.pro__article__p} ${styles.pro__article__p__hover}`}
            >
              <Link className={styles.pro__article__btn} href="/tarif">
                Mes prestations
              </Link>
            </p>
            <p className={styles.pro__article__p}>
              Vous aimeriez que nous fassions un bout de chemin ensemble et que
              je vous accompagne afin de retrouver de l’harmonie et de la
              complicité au sein de votre pro ?
            </p>
            <p className={styles.pro__article__p}>
              Si vous souhaitez me contacter ou prendre rendez-vous, cliquez sur
              le bouton ci-dessous.
            </p>
            <p
              className={`${styles.pro__article__p} ${styles.pro__article__p__hover}`}
            >
              <Link className={styles.pro__article__btn} href="/contact">
                Prendre rendez-vous
              </Link>
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Pro;
