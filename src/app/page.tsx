import styles from "./page.module.scss";
import Image from "next/image";
import GoDown from "./components/goDown/goDown";
import Card from "./components/card/Card";
import WhileInView from "./components/framer/WhileInView";
import Parallax from "./components/framer/parallax";
import GoTarif from "./components/goTarif/goTarif";

export default function Home() {
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
            <h1 className={styles.home__bg__container__h1}>
              Thierry <br />
              Da Silva
            </h1>
            <p className={styles.home__bg__container__p}>
              Coach professionnel certifié, je vous accompagne dans votre
            </p>
            <p className={styles.home__bg__container__p}>
              développement personnel et professionnel.
            </p>
            <GoTarif />
          </div>
          <GoDown />
        </section>
        <section className={styles.home__who}>
          <div className={styles.home__who__container}>
            <h2 className={styles.home__who__container__h2}>
              Vous êtes en quête <br /> de bien-être ?
            </h2>

            <p className={styles.home__who__container__p}>
              En offrant un espace pour la réflexion, le coaching peut aider à
              améliorer la qualité de vie et favoriser la croissance
              personnelle. Comment ? En encourageant l&apos;autoréflexion et la
              prise de conscience de ses propres pensées, comportements et
              motivations.
            </p>

            <div className={styles.home__who__container__content}>
              <div className={styles.home__who__container__content__div}>
                <h2 className={styles.home__who__container__content__div__h3}>
                  Coacher une personne, c’est quoi ?
                </h2>

                <p className={styles.home__who__container__content__div__p}>
                  Coacher une personne, c&apos;est lui fournir un accompagnement
                  personnalisé dans le but de l&apos;aider à atteindre des
                  objectifs spécifiques, à développer ses compétences, à
                  résoudre des problèmes ou à réaliser des changements positifs
                  dans sa vie personnelle ou professionnelle. Le coach agit
                  comme un facilitateur. Il va permettre à une personne de
                  libérer son potentiel pour maximiser ses performances.
                </p>
              </div>
              <WhileInView
                type="y"
                className={styles.home__who__container__content__div__card}
              >
                <Image
                  className={
                    styles.home__who__container__content__div__card__img
                  }
                  width="0"
                  height="0"
                  sizes="100vw"
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
            <h2 className={styles.home__what__container__h2}>
              Le coaching de vie, <br /> c’est quoi ?
            </h2>

            <div className={styles.home__what__container__content}>
              <WhileInView
                type="y"
                className={styles.home__what__container__content__card}
              >
                <Image
                  width="0"
                  height="0"
                  sizes="100vw"
                  className={styles.home__what__container__content__card__img}
                  priority={true}
                  src={"/assets/img/avenue.jpg"}
                  alt="bousole"
                />
              </WhileInView>

              <div className={styles.home__what__container__content__div}>
                <p className={styles.home__what__container__content__div__p}>
                  Le coaching est un processus visant à accompagner une personne
                  ou un groupe dans l&apos;atteinte de leurs objectifs
                  personnels ou professionnels, ainsi que dans le développement
                  de leurs compétences et de leur potentiel. Il s&apos;agit
                  d&apos;une relation collaborative où le coach fournit un cadre
                  spécifique qui va permettre à son client de réaliser un
                  travail d’introspection.
                </p>
                <p className={styles.home__what__container__content__div__p}>
                  Le coach n&apos;est pas là pour donner des conseils, des
                  solutions ou des réponses toutes faites, mais plutôt pour
                  amener son client à explorer ses propres pensées, à découvrir
                  des solutions et à prendre des décisions éclairées.
                </p>
                <p className={styles.home__what__container__content__div__p}>
                  Enfin, le coaching se différencie de la thérapie en ce sens
                  qu&apos;il se concentre principalement sur le présent et
                  l&apos;avenir, sur l&apos;action et la réalisation
                  d&apos;objectifs spécifiques (la thérapie se penche davantage
                  sur le passé, les émotions profondes et la guérison
                  psychologique).
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.home__goal}>
          <h2 className={styles.home__goal__h2}>Quel est votre objectif ?</h2>

          <div className={styles.home__goal__container}>
            <Card
              title={"Mieux gérer ses émotions"}
              content={
                "Les défis et les obstacles peuvent parfois sembler insurmontables. Un coach professionnel peut vous aider à identifier les schémas négatifs de pensée et de comportement qui entravent votre progression. Il vous permettra de trouver des stratégies pour les surmonter."
              }
            />

            <Card
              title={"Améliorer ses relations interpersonnelles"}
              content={
                "Si vous avez des difficultés dans vos relations de couple, avec votre famille ou vos relations professionnelles, un coach professionnel peut vous aider à améliorer la communication, à développer des compétences en résolution de conflits et à renforcer les liens."
              }
            />

            <Card
              title={"Améliorer ses performances"}
              content={
                "Le coaching vous pousse à sortir de votre zone de confort et à vous engager dans une dynamique de croissance personnelle. Vous explorerez de nouvelles perspectives, apprendrez à vous connaître plus en profondeur et développerez un sentiment de réalisation personnelle."
              }
            />

            <Card
              title={"Amélioter sa confiance en soi"}
              content={
                "Un manque de confiance en soi peut être un frein majeur à la réalisation de vos objectifs. Un coach professionnel peut vous aider à reconnaître et à renforcer vos forces, à vous accepter tel que vous êtes et à développer une confiance en vous solide."
              }
            />

            <Card
              title={"Gestion du Stress"}
              content={
                "La vie moderne peut être stressante. Un coach professionnel vous aidera à trouver des techniques de gestion du stress, de relaxation et de prise de recul pour mieux faire face aux défis de la vie quotidienne."
              }
            />

            <Card
              title={"Poser des limites et les faire respecter"}
              content={
                "Un coach professionnel vous aidera à mieux vous connaitre et à mieux évaluer vos besoins. Cela vous permettra d’être fidèle à vos valeurs et de pouvoir être pleinement vous-même."
              }
            />
          </div>
        </section>
      </main>
    </>
  );
}
