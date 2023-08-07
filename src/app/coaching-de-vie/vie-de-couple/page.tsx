import WhileInView from "@/app/components/framer/WhileInView";
import styles from "./page.module.scss";
import Image from "next/image";

const Couple = () => {
  return (
    <main className={styles.couple}>
      <WhileInView>
        <h1 className={styles.couple__h1}>Vie de couple</h1>
      </WhileInView>
      <div className={styles.couple__container}>
        <div className={styles.couple__article}>
          <WhileInView>
            <h2 className={styles.couple__article__h2}>
              Pourquoi faire du coaching de couple ?
            </h2>
          </WhileInView>
          <div className={styles.couple__article__div}>
            <WhileInView className={styles.couple__article__div__text}>
              <div>
                <WhileInView>
                  <p>
                    Le couple est l’espace où chacun laisse éclore ce qu’il a de
                    plus fragile et délicat. Il est le territoire où nous
                    pouvons révéler sans crainte nos faiblesses comme nos
                    forces.
                  </p>
                </WhileInView>
                <WhileInView>
                  <p>
                    Tous les couples, à un moment ou à un autre, vivent des
                    moments agréables et des moments plus difficiles. Lors de
                    ces moments d’impasses ou de défis, certains couples
                    décident soit de :
                  </p>
                </WhileInView>
                <WhileInView>
                  <ul>
                    <li>Se séparer ;</li>
                    <li>Continuer à lutter l’un contre l’autre ;</li>
                    <li>
                      Se résigner et « vivre avec la situation » sans jamais
                      rien régler ;
                    </li>
                    <li>
                      Traverser l’impasse pour en sortir encore plus fort .
                    </li>
                  </ul>
                </WhileInView>
              </div>
            </WhileInView>
            <div className={styles.couple__article__div__img}>
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
                  src={"/assets/img/couple.jpg"}
                  alt="bousole"
                />
              </WhileInView>
            </div>
          </div>
        </div>
        <div
          className={`${styles.couple__article} ${styles.couple__article__margin}`}
        >
          <div className={styles.couple__article__div}>
            <div className={styles.couple__article__div__img}>
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
                  src={"/assets/img/foret.jpg"}
                  alt="bousole"
                />
              </WhileInView>
            </div>
            <WhileInView className={styles.couple__article__div__text}>
              <div>
                <WhileInView>
                  <p>
                    Les couples qui souhaitent vivre une vie amoureuse épanouie,
                    saine et équilibrée choisissent de faire face à leur
                    situation et de traverser l’impasse pour en sortir encore
                    plus fort. L’un des moyens privilégiés des couples pour
                    avoir l’aide ou l’accompagnement nécessaire aux changements
                    souhaités est d’avoir recours à un coach conjugal.
                  </p>
                </WhileInView>
              </div>
            </WhileInView>
          </div>
        </div>
        <div className={styles.couple__article}>
          <WhileInView>
            <h2 className={styles.couple__article__h2}>
              Comment tds-coachingdevie peut vous aider ?
            </h2>
          </WhileInView>
          <WhileInView>
            <div className={styles.couple__article__div__big}>
              <WhileInView>
                <p>
                  Un couple est la réunion de deux personnes qui ont chacune une
                  histoire, des valeurs, des croyances, des envies qui leur sont
                  propres. La rencontre de ces deux cultures nécessite un
                  partage, des ajustements, des concessions de part et d’autre.
                  Ce travail n’est pas toujours simple à réaliser.
                </p>
              </WhileInView>
              <WhileInView>
                <ul>
                  <li>
                    Accompagner le couple pour que chaque conjoint soit
                    bienveillant envers l’autre – Aider à créer de l’harmonie
                    dans le couple ;
                  </li>
                  <li>
                    Accompagner le couple pour amener les conjoints à mieux
                    communiquer (éviter les ruptures de dialogue, les
                    incompréhensions et le mal-être) ;
                  </li>
                  <li>
                    Coacher le couple pour solutionner les problématiques de
                    tension, stress, disputes et frustrations ;
                  </li>
                  <li>
                    Gérer les difficultés au sein d’une famille recomposée ;
                  </li>
                  <li>
                    Accompagnement des couples en difficultés avec les enfants ;
                  </li>
                  <li>
                    Gérer les difficultés liées aux changements de vie
                    (déménagement, situation professionnelle, …) .
                  </li>
                </ul>
              </WhileInView>
            </div>
          </WhileInView>
        </div>
        <div className={styles.couple__article}>
          <WhileInView>
            <p className={styles.couple__article__p__margin}>
              Si vous souhaitez en savoir plus sur la tarification, cliquez sur
              le bouton ci-dessous.
            </p>
          </WhileInView>
          <WhileInView>
            <p
              className={`${styles.couple__article__p} ${styles.couple__article__p__hover}`}
            >
              <a className={styles.couple__article__btn} href="/tarif">
                Mes prestations
              </a>
            </p>
          </WhileInView>
          <WhileInView>
            <p className={styles.couple__article__p}>
              Vous aimeriez que nous fassions un bout de chemin ensemble et que
              je vous accompagne afin de retrouver de l’harmonie et de la
              complicité entre vous ?
            </p>
          </WhileInView>
          <WhileInView>
            <p className={styles.couple__article__p}>
              Si vous souhaitez me contacter ou prendre rendez-vous, cliquez sur
              le bouton ci-dessous.
            </p>
          </WhileInView>
          <WhileInView>
            <p
              className={`${styles.couple__article__p} ${styles.couple__article__p__hover}`}
            >
              <a className={styles.couple__article__btn} href="/contact">
                Prendre rendez-vous
              </a>
            </p>
          </WhileInView>
          <WhileInView>
            <div
              className={`${styles.couple__article__div__big} ${styles.couple__article__div__big__margin}`}
            >
              <WhileInView>
                <p>Modalités des séances de coaching conjugal :</p>
              </WhileInView>
              <WhileInView>
                <ul className={styles.couple__article__div__big__padding}>
                  <li>
                    Le coaching de couple se fait en présentiel pour les
                    premières séances ;
                  </li>
                  <li>
                    Certaines séances sont réalisées en couple et d’autres en
                    individuel ;
                  </li>
                  <li>
                    Il implique la présence et la volonté de chaque membre de
                    bénéficier d’un coaching de couple .
                  </li>
                </ul>
              </WhileInView>
            </div>
          </WhileInView>
        </div>
      </div>
    </main>
  );
};

export default Couple;
