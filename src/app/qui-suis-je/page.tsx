import Card from "../components/card/Card";
import WhileInView from "../components/framer/WhileInView";
import Parallax from "../components/framer/parallax";
import Timeline from "./components/Timeline";
import styles from "./page.module.scss";
import Image from "next/image";

const About = () => {
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
      <main className={styles.about}>
        <section className={styles.about__bg}>
          <Image
            className={styles.about__bg__img}
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            src={"/assets/img/avenue.jpg"}
            alt="bousole"
          />
        </section>
        <section className={styles.about__parcour}>
          <h1 className={styles.about__parcour__h1}>Thierry Da Silva</h1>
          <div className={styles.about__parcour__container}>
            <Image
              className={styles.about__parcour__container__img}
              width="0"
              height="0"
              sizes="100vw"
              priority={true}
              src={"/assets/img/moi.jpeg"}
              alt="bousole"
            />
            <div>
              <h2 className={styles.about__parcour__container__h2}>
                Mon parcours professionnel :
              </h2>
              <p className={styles.about__parcour__container__p}>
                Aux cours de 30 années passées dans le management des
                organisations au sein du ministère de la défense, j’ai développé
                des compétences qui m’ont permis de m’adapter continuellement à
                de nouvelles fonctions et de nouveaux environnements.
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
            </div>
          </div>
        </section>
        <section className={styles.about__vision}>
          <div className={styles.about__vision__container}>
            <h2 className={styles.about__vision__container__h2}>
              Ma vision du coaching
            </h2>
            <div className={styles.about__vision__container__content}>
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
              <Image
                width="0"
                height="0"
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
            </div>
          </div>
        </section>

        <section className={styles.about__certificate}>
          <h2 className={styles.about__certificate__h2}>Mes formations</h2>
          <div className={styles.about__certificate__container}>
            <div className={styles.about__certificate__container__line}>
              <div className={styles.about__certificate__container__card__left}>
                <div
                  className={
                    styles.about__certificate__container__card__left__triangle
                  }
                ></div>
                <div
                  className={
                    styles.about__certificate__container__card__left__cercle
                  }
                ></div>
                <h3
                  className={
                    styles.about__certificate__container__card__left__h3
                  }
                >
                  Certificat de coach professionnel – International NLP
                </h3>
                <p
                  className={
                    styles.about__certificate__container__card__left__date
                  }
                >
                  2013
                </p>
              </div>
              <div
                className={styles.about__certificate__container__card__right}
              >
                <div
                  className={
                    styles.about__certificate__container__card__right__triangle
                  }
                ></div>
                <div
                  className={
                    styles.about__certificate__container__card__right__cercle
                  }
                ></div>
                <h3
                  className={
                    styles.about__certificate__container__card__right__h3
                  }
                >
                  Certificat de formation en mémoire, concentration et
                  créativité – Formalis – Accréditation IPHM et Qualiopi
                </h3>
                <p
                  className={
                    styles.about__certificate__container__card__right__date
                  }
                >
                  2013
                </p>
              </div>
              <div className={styles.about__certificate__container__card__left}>
                <div
                  className={
                    styles.about__certificate__container__card__left__triangle
                  }
                ></div>
                <div
                  className={
                    styles.about__certificate__container__card__left__cercle
                  }
                ></div>
                <h3
                  className={
                    styles.about__certificate__container__card__left__h3
                  }
                >
                  Certificat de formation en coaching de vie – Formalis –
                  Accréditation IPHM et Qualiopi
                </h3>
                <p
                  className={
                    styles.about__certificate__container__card__left__date
                  }
                >
                  2013
                </p>
              </div>
              <div
                className={styles.about__certificate__container__card__right}
              >
                <div
                  className={
                    styles.about__certificate__container__card__right__triangle
                  }
                ></div>
                <div
                  className={
                    styles.about__certificate__container__card__right__cercle
                  }
                ></div>
                <h3
                  className={
                    styles.about__certificate__container__card__right__h3
                  }
                >
                  Certificat de formation en coaching parental – Formalis –
                  Accréditation IPHM et Qualiopi
                </h3>
                <p
                  className={
                    styles.about__certificate__container__card__right__date
                  }
                >
                  2013
                </p>
              </div>
              <div className={styles.about__certificate__container__card__left}>
                <div
                  className={
                    styles.about__certificate__container__card__left__triangle
                  }
                ></div>
                <div
                  className={
                    styles.about__certificate__container__card__left__cercle
                  }
                ></div>
                <h3
                  className={
                    styles.about__certificate__container__card__left__h3
                  }
                >
                  Certificat de formation en coaching conjugal – Formalis –
                  Accréditation IPHM et Qualiopi
                </h3>
                <p
                  className={
                    styles.about__certificate__container__card__left__date
                  }
                >
                  2013
                </p>
              </div>
              <div
                className={styles.about__certificate__container__card__right}
              >
                <div
                  className={
                    styles.about__certificate__container__card__right__triangle
                  }
                ></div>
                <div
                  className={
                    styles.about__certificate__container__card__right__cercle
                  }
                ></div>
                <h3
                  className={
                    styles.about__certificate__container__card__right__h3
                  }
                >
                  DESS Certificat d’aptitude à l’administration des entreprises
                  – Université Paris 1-Panthéon Sorbonne
                </h3>
                <p
                  className={
                    styles.about__certificate__container__card__right__date
                  }
                >
                  2013
                </p>
              </div>
              <div className={styles.about__certificate__container__card__left}>
                <div
                  className={
                    styles.about__certificate__container__card__left__triangle
                  }
                ></div>
                <div
                  className={
                    styles.about__certificate__container__card__left__cercle
                  }
                ></div>
                <h3
                  className={
                    styles.about__certificate__container__card__left__h3
                  }
                >
                  Master of Business Administration (MBA) – IAE Paris –
                  Université Paris 1-Panthéon Sorbonne
                </h3>
                <p
                  className={
                    styles.about__certificate__container__card__left__date
                  }
                >
                  2013
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.about__speciality}>
          <div className={styles.about__speciality__container}>
            <h2 className={styles.about__speciality__container__h2}>
              Mes spécialitées :
            </h2>
            <div className={styles.about__speciality__container__content}>
              <Card
                title={"Clarté et Objectifs"}
                content={
                  "Un coach de vie peut vous aider à définir des objectifs clairs et significatifs dans les domaines qui comptent le plus pour vous. Il vous guidera à travers un processus de réflexion approfondie pour définir ce que vous voulez vraiment et élaborer un plan pour y parvenir."
                }
              />

              <Card
                title={"Surmonter les Obstacles"}
                content={
                  "Les défis et les obstacles peuvent parfois sembler insurmontables. Un coach de vie peut vous aider à identifier les schémas négatifs de pensée et de comportement qui entravent votre progression, et vous fournir des stratégies pour les surmonter."
                }
              />

              <Card
                title={"Améliorer les Relations"}
                content={
                  "Si vous avez des difficultés dans vos relations de couple, votre famille ou vos relations professionnelles, un coach de vie peut vous aider à améliorer la communication, à développer des compétences en résolution de conflits et à renforcer les liens."
                }
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
