import WhileInView from "../components/framer/WhileInView";
import ImageDisplay from "../components/image/image";
import styles from "./page.module.scss";
import Image from "next/image";

const Coaching = () => {
  return (
    <main className={styles.coaching}>
      <WhileInView>
        <h1 className={styles.coaching__h1}>Coaching de vie</h1>
      </WhileInView>
      <div className={styles.coaching__container}>
        <div className={styles.coaching__article}>
          <WhileInView>
            <h2 className={styles.coaching__article__h2}>
              Etes-vous prêt à libérer tout votre potentiel ?
            </h2>
          </WhileInView>
          <WhileInView>
            <div className={styles.coaching__border}>
              <WhileInView>
                <p>
                  Le coaching de vie vie est un accompagnement bref en
                  développement personnel. Il consiste à aider une personne
                  rencontrant des difficultés à trouver ses propres solutions.
                  Le but est de développer l’<strong>autonomie</strong> du
                  coaché.
                </p>
              </WhileInView>
              <WhileInView>
                <p>
                  tds-coachingdevie est là pour vous accompagner au travers de
                  séances de coaching personnalisées qui s’adapteront à vos
                  besoins.
                </p>
              </WhileInView>
            </div>
          </WhileInView>

          <div className={styles.coaching__flex}>
            <p className={styles.coaching__flex__picture}>
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
            </p>
            <WhileInView>
              <div className={styles.coaching__flex__div}>
                <WhileInView>
                  <p className={styles.coaching__flex__div__p}>
                    Mes spécialités :
                  </p>
                </WhileInView>
                <WhileInView>
                  <ul className={styles.coaching__flex__div__ul}>
                    <li>Gestion des adolescents</li>
                    <li>Les familles recomposées</li>
                    <li>Reconversion professionnelle</li>
                  </ul>
                </WhileInView>
              </div>
            </WhileInView>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Coaching;
