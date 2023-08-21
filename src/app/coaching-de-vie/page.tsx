import WhileInView from "../components/framer/WhileInView";
import styles from "./page.module.scss";
import Image from "next/image";

const Coaching = () => {
  return (
    <main className={styles.coaching}>
      <h1 className={styles.coaching__h1}>Coaching de vie</h1>
      <div className={styles.coaching__container}>
        <div className={styles.coaching__article}>
          <WhileInView>
            <h2 className={styles.coaching__article__h2}>
              Etes-vous prêt à libérer tout votre potentiel ?
            </h2>
          </WhileInView>
          <WhileInView>
            <div className={styles.coaching__border}>
              <p>
                Le coaching de vie vie est un accompagnement bref en
                développement personnel. Il consiste à aider une personne
                rencontrant des difficultés à trouver ses propres solutions. Le
                but est de développer l’<strong>autonomie</strong> du coaché.
              </p>
              <p>
                tds-coachingdevie est là pour vous accompagner au travers de
                séances de coaching personnalisées qui s’adapteront à vos
                besoins.
              </p>
            </div>
          </WhileInView>

          <div className={styles.coaching__flex}>
            <div className={styles.coaching__flex__picture}>
              <WhileInView>
                <Image
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                    borderRadius: "20px",
                  }}
                  priority={true}
                  src={"/assets/img/cible.jpg"}
                  alt="bousole"
                />
              </WhileInView>
            </div>
            <WhileInView>
              <div className={styles.coaching__flex__div}>
                <p className={styles.coaching__flex__div__p}>
                  Mes spécialités :
                </p>
                <ul className={styles.coaching__flex__div__ul}>
                  <li>Gestion des adolescents</li>
                  <li>Les familles recomposées</li>
                  <li>Reconversion professionnelle</li>
                </ul>
              </div>
            </WhileInView>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Coaching;
