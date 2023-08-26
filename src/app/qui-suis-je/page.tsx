import WhileInView from "../components/framer/WhileInView";
import Parallax from "../components/framer/parallax";
import styles from "./page.module.scss";
import Image from "next/image";

const About = () => {
  return (
    <main className={styles.about}>
      <section className={styles.about__bg}>
        <Image
          className={styles.about__bg__img}
          width="0"
          height="400"
          sizes="100vw"
          priority={true}
          src={"/assets/img/avenue.jpg"}
          alt="bousole"
        />
      </section>
      <section className={styles.about__parcour}>
        <h1 className={styles.about__parcour__h1}>Thierry Da Silva</h1>
        <div className={styles.about__parcour__container}>
          <WhileInView
            style={{
              width: "300px",
              height: "300px",
              marginRight: "100px",
              marginBottom: "80px",
              float: "left",
            }}
          >
            <Image
              width="0"
              height="0"
              sizes="100vw"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                shapeOutside: "circle()",
              }}
              priority={true}
              src={"/assets/img/moi.jpeg"}
              alt="bousole"
            />
          </WhileInView>
          <WhileInView>
            <h2 className={styles.about__parcour__container__h2}>
              Mon parcours professionnel :
            </h2>
          </WhileInView>
          <WhileInView>
            <p>
              Aux cours de 30 années passées dans le management des
              organisations au sein du ministère de la défense, j’ai développé
              des compétences qui m’ont permis de m’adapter continuellement à de
              nouvelles fonctions et de nouveaux environnements.
              <br />
              A la suite d’un travail personnel en psychothérapie,
              comportementalisme et psychanalyse, j’ai décidé d’engager une
              reconversion professionnelle dans le coaching.
              <br />
              Ayant obtenu une certification de coach de vie, j’accompagne
              aujourd’hui des personnes qui souhaitent prendre conscience de
              leurs forces et apprendre à se mobiliser dans un objectif de
              bien-être et de performance.
            </p>
          </WhileInView>
        </div>
      </section>
      <section className={styles.about__vision}>
        <div className={styles.about__vision__container}>
          <WhileInView>
            <h2 className={styles.about__vision__container__h2}>
              Ma vision du coaching :
            </h2>
          </WhileInView>
          <div className={styles.about__vision__container__content}>
            <WhileInView>
              <p className={styles.about__vision__container__content__p}>
                Chaque individu dispose au plus profond de lui des ressources
                nécessaires pour réussir à atteindre ses objectifs.
                <br />
                Un coach ne donne pas de conseils ni de solutions clef en main à
                son client. Il agit comme un révélateur des capacités et du
                potentiel latent chez le coaché.
                <br />
                Mon objectif est d’aider d’autres personnes à accéder à leur
                plein potentiel. Il s’agit de les encourager à accepter leurs
                responsabilités, à faire des choix qui mèneront à de plus hauts
                niveaux de réalisation personnelle. Mon travail d’accompagnement
                consiste à aider mes clients, de les encourager à atteindre
                leurs objectifs et vivre la vie qu’ils désirent.
                <br />
                J’aide mon client à analyser sa situation actuelle, à établir
                l’itinéraire des différentes étapes nécessaires à l’atteinte de
                ses objectifs, en tenant compte de ses obstacles.
                <br />
                Le coaching est pour moi une véritable activité humaine
                passionnante où je mets tout mon savoir-faire dans un
                accompagnement sans jugements ni critiques.
              </p>
            </WhileInView>
            <Parallax>
              <Image
                width="500"
                height="500"
                sizes="100vw"
                style={{
                  objectFit: "contain",
                  position: "relative",
                  zIndex: 2,
                }}
                priority={true}
                src={"/assets/img/vision.png"}
                alt="bousole"
              />
            </Parallax>
          </div>
        </div>
      </section>
      <section className={styles.about__certificate}>
        <h2 className={styles.about__certificate__h2}>Formations :</h2>
        <div className={styles.about__certificate__container}>
          <WhileInView>
            <ul className={styles.about__certificate__container__ul}>
              <li>Certificat de coach professionnel – International NLP</li>
              <li>
                Certificat de formation en mémoire, concentration et créativité
                – Formalis – Accréditation IPHM et Qualiopi
              </li>
              <li>
                Certificat de formation en coaching de vie – Formalis –
                Accréditation IPHM et Qualiopi
              </li>
              <li>
                Certificat de formation en coaching parental – Formalis –
                Accréditation IPHM et Qualiopi
              </li>
              <li>
                Certificat de formation en coaching conjugal – Formalis –
                Accréditation IPHM et Qualiopi
              </li>
              <li>
                DESS Certificat d’aptitude à l’administration des entreprises –
                Université Paris 1-Panthéon Sorbonne
              </li>
              <li>
                Master of Business Administration (MBA) – IAE Paris – Université
                Paris 1-Panthéon Sorbonne
              </li>
            </ul>
          </WhileInView>
        </div>
      </section>
      <section className={styles.about__speciality}>
        <div className={styles.about__speciality__container}>
          <WhileInView>
            <h2 className={styles.about__speciality__container__2}>
              Mes spécialitées :
            </h2>
          </WhileInView>
          <div className={styles.about__speciality__container__content}>
            <WhileInView>
              <div
                className={styles.about__speciality__container__content__card}
              >
                <h3
                  className={
                    styles.about__speciality__container__content__card__h3
                  }
                >
                  Clarté et Objectifs
                </h3>
                <Image
                  className={
                    styles.about__speciality__container__content__card__img
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/goal.png"}
                  alt="bousole"
                />
                <p
                  className={
                    styles.about__speciality__container__content__card__p
                  }
                >
                  Un coach de vie peut vous aider à définir des objectifs clairs
                  et significatifs dans les domaines qui comptent le plus pour
                  vous. Il vous guidera à travers un processus de réflexion
                  approfondie pour définir ce que vous voulez vraiment et
                  élaborer un plan pour y parvenir.
                </p>
              </div>
            </WhileInView>
            <WhileInView>
              <div
                className={styles.about__speciality__container__content__card}
              >
                <h3
                  className={
                    styles.about__speciality__container__content__card__h3
                  }
                >
                  Surmonter les Obstacles
                </h3>
                <Image
                  className={
                    styles.about__speciality__container__content__card__img
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/difficulties.png"}
                  alt="bousole"
                />
                <p
                  className={
                    styles.about__speciality__container__content__card__p
                  }
                >
                  Les défis et les obstacles peuvent parfois sembler
                  insurmontables. Un coach de vie peut vous aider à identifier
                  les schémas négatifs de pensée et de comportement qui
                  entravent votre progression, et vous fournir des stratégies
                  pour les surmonter.
                </p>
              </div>
            </WhileInView>
            <WhileInView>
              <div
                className={styles.about__speciality__container__content__card}
              >
                <h3
                  className={
                    styles.about__speciality__container__content__card__h3
                  }
                >
                  Améliorer les Relations
                </h3>
                <Image
                  className={
                    styles.about__speciality__container__content__card__img
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/relationships.png"}
                  alt="bousole"
                />
                <p
                  className={
                    styles.about__speciality__container__content__card__p
                  }
                >
                  Si vous avez des difficultés dans vos relations de couple,
                  votre famille ou vos relations professionnelles, un coach de
                  vie peut vous aider à améliorer la communication, à développer
                  des compétences en résolution de conflits et à renforcer les
                  liens.
                </p>
              </div>
            </WhileInView>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
