import Timeline from "./components/Timeline";
import styles from "./page.module.scss";
import Image from "next/image";
import "react-vertical-timeline-component/style.min.css";
import localFont from "next/font/local";
import NoScript from "../components/noscript/NoScript";
const Parisienne = localFont({
  src: "../Parisienne-Regular.ttf",
  display: "swap",
});

export const metadata = {
  title: "Thierry DA SILVA coach professionnel certifié - tdscoaching",
  description:
    "Thierry DA SILVA coach professionnel certifié, vous accompagne pour surmonter vos difficultés et vous accomplir dans la durée",
};

const About = () => {
  return (
    <>
      <NoScript />
      <main className={styles.about}>
        <div className={styles.about__bg}>
          <Image
            className={styles.about__bg__img}
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            src={"/assets/test/sunlight2.webp"}
            alt="bousole"
          />
        </div>
        <section className={styles.about__parcour}>
          <h1
            className={`${styles.about__parcour__h1} ${Parisienne.className}`}
          >
            Thierry Da Silva
          </h1>
          <div className={styles.about__parcour__container}>
            <Image
              className={styles.about__parcour__container__img}
              width="0"
              height="0"
              sizes="100vw"
              priority={true}
              src={"/assets/img/moi21.webp"}
              alt="Thierry DA SILVA coach professionnel certifié"
            />
            <article>
              <h2
                className={`${styles.about__parcour__container__h2} ${Parisienne.className}`}
              >
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
                les personnes : inégalités socio-économiques, insécurité,
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
            </article>
          </div>
        </section>
        <section className={styles.about__vision}>
          <h2
            className={`${styles.about__vision__container__h2} ${Parisienne.className}`}
          >
            Ma vision du coaching
          </h2>
          <p className={styles.about__vision__container__content__p}>
            Chaque individu dispose au plus profond de lui des ressources
            nécessaires pour réussir à atteindre ses objectifs.
            <br />
            Un coach ne donne pas de conseils ni de solutions clef en main à son
            client. Il agit comme un révélateur des capacités et du potentiel
            latent chez le coaché.
            <br />
            Mon objectif est d’aider d’autres personnes à accéder à leur plein
            potentiel. Il s’agit de les encourager à accepter leurs
            responsabilités, à faire des choix qui mèneront à de plus hauts
            niveaux de réalisation personnelle. Mon travail d’accompagnement
            consiste à aider mes clients, de les encourager à atteindre leurs
            objectifs et vivre la vie qu’ils désirent.
            <br />
            J’aide mon client à analyser sa situation actuelle, à établir
            l’itinéraire des différentes étapes nécessaires à l’atteinte de ses
            objectifs, en tenant compte de ses obstacles.
            <br />
            Le coaching est pour moi une véritable activité humaine passionnante
            où je mets tout mon savoir-faire dans un accompagnement sans
            jugements ni critiques.
          </p>
        </section>

        <section className={styles.about__certificate}>
          <h2
            className={`${styles.about__certificate__h2} ${Parisienne.className}`}
          >
            Mes formations
          </h2>
          <div className={styles.about__certificate__container}>
            <Timeline />
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
