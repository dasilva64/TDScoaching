import ImageDisplay from "../components/image/image";
import styles from "./page.module.scss";

const Coaching = () => {
  return (
    <main className={styles.coaching}>
      <h1 className={styles.coaching__h1}>Coaching de vie</h1>
      <div className={styles.coaching__container}>
        <div className={styles.coaching__article}>
          <h2 className={styles.coaching__article__h2}>
            Etes-vous prêt à libérer tout votre potentiel ?
          </h2>
          <div className={styles.coaching__border}>
            <p>
              Le coaching de vie vie est un accompagnement bref en développement
              personnel. Il consiste à aider une personne rencontrant des
              difficultés à trouver ses propres solutions. Le but est de
              développer l’<strong>autonomie</strong> du coaché.
            </p>
            <p>
              tds-coachingdevie est là pour vous accompagner au travers de
              séances de coaching personnalisées qui s’adapteront à vos besoins.
            </p>
          </div>

          <div className={styles.coaching__flex}>
            <p className={styles.coaching__flex__picture}>
              <ImageDisplay
                path="/assets/img/cible.jpg"
                className="left"
                border="20px"
              />
            </p>
            <div className={styles.coaching__flex__div}>
              <p className={styles.coaching__flex__div__p}>Mes spécialités :</p>
              <ul className={styles.coaching__flex__div__ul}>
                <li>Gestion des adolescents</li>
                <li>Les familles recomposées</li>
                <li>Reconversion professionnelle</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Coaching;
