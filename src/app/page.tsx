import styles from "./page.module.scss";
import Image from "next/image";
import WhileInView from "./components/framer/WhileInView";
import GoDown from "./components/goDown/goDown";
import Parallax from "./components/framer/parallax";
import Card from "./components/card/Card";

export default function Home() {
  return (
    <main className={styles.home}>
      <section className={styles.home__bg}>
        <Image
          className={styles.home__bg__img}
          width="0"
          height="0"
          sizes="100vw"
          priority={true}
          src={"/assets/img/moi.jpeg"}
          alt="bousole"
        />
        <div className={styles.home__bg__container}>
          <h1 className={styles.home__bg__container__h1}>Thierry Da Silva</h1>
          <p className={styles.home__bg__container__p}>
            Coach de vie certifié, je vous accompagne dans votre
          </p>
          <p className={styles.home__bg__container__p}>
            développement personnel et professionnel.
          </p>
          <button className={styles.home__bg__container__btn}>
            Voir les offres
          </button>
        </div>
        <GoDown />
      </section>
      <section className={styles.home__who}>
        <div className={styles.home__who__container}>
          <WhileInView>
            <h2 className={styles.home__who__container__h2}>
              Vous êtes en quête de bien-être ? Le coaching de vie peut vous
              apporter des solutions.
            </h2>
          </WhileInView>
          <p>
            Le coaching est l’accompagnement d’une personne dans un processus de
            changement. Le coach agit comme facilitateur de l’évolution. Il
            apporte une vision extérieure, prend le rôle d’un partenaire
            objectif et permet à la personne coachée d’atteindre ses objectifs
            plus efficacement et plus rapidement.
          </p>
          <div className={styles.home__who__container__content}>
            <WhileInView
              style={{
                display: "flex",
              }}
            >
              <div className={styles.home__who__container__content__div}>
                <h3>Coacher une personne, c’est quoi ?</h3>
                <p>
                  Coacher quelqu’un, c’est libérer son potentiel pour maximiser
                  ses performances. C’est l’aider à apprendre plutôt que de lui
                  enseigner. Le coaching de vie implique également de fournir
                  des outils et des techniques spécifiques pour vous aider à
                  surmonter les obstacles et à atteindre vos objectifs. Coacher
                  quelqu’un, c’est libérer son potentiel pour maximiser ses
                  performances. C’est l’aider à apprendre plutôt que de lui
                  enseigner.
                </p>
              </div>
            </WhileInView>
            <WhileInView style={{ display: "flex" }}>
              <Image
                className={styles.home__who__container__content__img}
                width="400"
                height="300"
                priority={true}
                src={"/assets/img/avenue.jpg"}
                alt="bousole"
              />
            </WhileInView>
          </div>
        </div>
      </section>
      <section className={styles.home__what}>
        <div className={styles.home__what__container}>
          <WhileInView>
            <h2 className={styles.home__what__container__h2}>
              Le coaching de vie, c’est quoi ?
            </h2>
          </WhileInView>
          <div className={styles.home__what__container__content}>
            <WhileInView style={{ display: "flex" }}>
              <Image
                width="500"
                height="0"
                className={styles.home__what__container__content__img}
                priority={true}
                src={"/assets/img/avenue.jpg"}
                alt="bousole"
              />
            </WhileInView>
            <WhileInView>
              <div className={styles.home__what__container__content__div}>
                <p>
                  Le coaching de vie s’est largement développé à partir des
                  années 1990 et couvre tous les domaines de la vie :
                </p>
                <ul className={styles.home__what__container__content__div__ul}>
                  <li>Vie familiale</li>
                  <li>Vie professionnelle</li>
                  <li>Vie de couple</li>
                  <li>Vie liée à l’épanouissement personnel</li>
                  <li>Vie sociale</li>
                </ul>
                <p>
                  Le coaching permet de prendre le temps de se poser ou mieux
                  gérer son temps, de réfléchir, de se (re) trouver, de se (re)
                  connaître, de s’orienter, de prendre des décisions,
                  d’équilibrer ses domaines de vie, de communiquer plus
                  facilement avec autrui, de mieux équilibrer sa vie
                  professionnelle et sa vie privée et de manière générale de{" "}
                  <strong>vivre mieux</strong>.
                </p>
                <p>
                  tds-cochingdevie vous accompagne sur toutes formes de
                  problèmes, dans différents domaines :
                </p>
                <p>
                  L’accompagnement dans un divorce, rencontrer quelqu’un,
                  apprendre à gérer son temps, optimiser son image, prendre soin
                  de soi (avec un objectif minceur), vaincre sa timidité, oser
                  être soi-même, affronter ses peurs, gagner en confiance, avoir
                  une meilleure estime de soi, apprendre à dire NON, poser des
                  limites, optimiser sa recherche d’emploi, mieux se connaitre
                  pour vivre en adéquation avec ses valeurs, oser prendre la
                  parole en public, mieux gérer son stress, aider dans la prise
                  de décision, bien gérer ses é, mettre en place une parentalité
                  positive et bienveillante, aider les parents à aider leurs
                  enfants, gérer les adolescents, mettre en place une bonne
                  communication, bien réagir face aux crises des enfants,
                  répartir les tâches quotidiennes, savoir rester calme, etc.
                </p>
              </div>
            </WhileInView>
          </div>
        </div>
      </section>
      <section className={styles.home__goal}>
        <WhileInView>
          <h2 className={styles.home__goal__h2}>Quel est votre objectif ?</h2>
        </WhileInView>
        <div className={styles.home__goal__container}>
          <WhileInView>
            <Card
              title={"Clarté et Objectifs"}
              content={
                "Un coach de vie peut vous aider à définir des objectifs clairs et significatifs dans les domaines qui comptent le plus pour vous. Il vous guidera à travers un processus de réflexion approfondie pour définir ce que vous voulez vraiment et élaborer un plan pour y parvenir."
              }
            />
          </WhileInView>
          <WhileInView>
            <Card
              title={"Surmonter les Obstacles"}
              content={
                "Les défis et les obstacles peuvent parfois sembler insurmontables. Un coach de vie peut vous aider à identifier les schémas négatifs de pensée et de comportement qui entravent votre progression, et vous fournir des stratégies pour les surmonter."
              }
            />
          </WhileInView>
          <WhileInView>
            <Card
              title={"Améliorer les Relations"}
              content={
                "Si vous avez des difficultés dans vos relations de couple, votre famille ou vos relations professionnelles, un coach de vie peut vous aider à améliorer la communication, à développer des compétences en résolution de conflits et à renforcer les liens."
              }
            />
          </WhileInView>
          <WhileInView>
            <Card
              title={"Confiance en Soi"}
              content={
                "Un manque de confiance en soi peut être un frein majeur à la réalisation de vos objectifs. Un coach de vie peut vous aider à reconnaître et à renforcer vos forces, à vous accepter tel que vous êtes et à développer une confiance en vous solide."
              }
            />
          </WhileInView>
          <WhileInView>
            <Card
              title={"Gestion du Stress"}
              content={
                "La vie moderne peut être stressante. Un coach de vie peut vous enseigner des techniques de gestion du stress, de relaxation et de prise de recul pour mieux faire face aux défis de la vie quotidienne."
              }
            />
          </WhileInView>
          <WhileInView>
            <Card
              title={"Croissance Personnelle"}
              content={
                "Le coaching de vie vous pousse à sortir de votre zone de confort et à vous engager dans un voyage de croissance personnelle. Vous explorerez de nouvelles perspectives, apprendrez à vous connaître plus en profondeur et développerez un sentiment de réalisation personnelle."
              }
            />
          </WhileInView>
        </div>
      </section>
    </main>
  );
}
