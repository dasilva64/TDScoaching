import Card from "../components/card/Card";
import WhileInView from "../components/framer/WhileInView";
import Parallax from "../components/framer/parallax";
import Timeline from "./components/Timeline";
import styles from "./page.module.scss";
import Image from "next/image";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

export const metadata = {
  title: "Thierry DA SILVA coach professionnel certifié - tdscoaching",
};

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
            src={"/assets/test/sunlight.jpg"}
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
              alt="Thierry DA SILVA coach professionnel certifié"
            />
            <div>
              <h2 className={styles.about__parcour__container__h2}>
                Mon parcours professionnel
              </h2>
              <p className={styles.about__parcour__container__p}>
                Je m’appelle Thierry DA SILVA SEABRA et je suis coach
                professionnel certifié. J’ai été manager au sein du ministère de
                la défense pendant 30 ans. J’ai aimé cet univers stimulant fait
                de rigueur et d’exigence où j’ai pu développer le goût de
                l’effort et la confiance en soi. Cela m’a permis de m’adapter à
                des conditions difficiles, des situations de stress intense, en
                développant une certaine résilience. Depuis une dizaine
                d’années, je ressens le besoin de relever de nouveaux défis et
                de servir l’humain différemment. C’est dans ce cadre que j’ai
                suivi une formation de coach professionnel certifié à l’Institut
                international de Coaching de Genève, dont le programme est
                accrédité par l’ICF, première fédération internationale de
                coaching. Je prépare également l’accréditation internationale
                ACC délivrée par la fédération internationale de coaching.
                Aujourd’hui notre société constitue un environnement propice au
                cumul de situations stressantes auxquelles peuvent être exposées
                les personnes : inégalités socio- économiques, insécurité,
                violence, haine, chômage et pauvreté entre autres. Nous ne
                sommes pas forcément tous concernés par le processus de
                résilience. En revanche, nous sommes tous concernés par la
                capacité que nous avons à nous adapter, à être ouvert et
                flexible pour faire des situations stressantes une occasion
                d&#39;apprendre, de rebondir afin d’éviter que cela devienne un
                traumatisme. C’est de cette façon que je conçois ma mission :
                permettre aux personnes d’atteindre un niveau de performance
                plus élevé de façon à les libérer du stress à travers mes
                activités de coaching et leur permettre de reprendre sereinement
                le cours de leur vie en réalisant leurs rêves.
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
            </div>
          </div>
        </section>

        <section className={styles.about__certificate}>
          <h2 className={styles.about__certificate__h2}>Mes formations</h2>
          <div className={styles.about__certificate__container}>
            <Timeline />
          </div>
        </section>
        {/*  <section className={styles.about__speciality}>
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
        </section> */}
      </main>
    </>
  );
};

export default About;
