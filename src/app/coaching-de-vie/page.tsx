import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import CardType from "./components/CardType";
import CardHelp from "./components/CardHelp";
import NoScript from "../components/noscript/NoScript";
import Footer from "../components/footer/footer";

export const metadata = {
  title: "Coaching familial, professionnel et de couple - tdscoaching",
  description:
    "Découvrez les différents types de coaching que je propose pour vous aidez à surmonter vos difficultés et à vous accomplir dans la durée : coaching familial, coaching professionnel et coaching de couple",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  keywords:
    "Développement personnel, Coaching professionnel, Relation de couple, Communication, Équilibre vie professionnelle-vie personnelle, Confiance en soi, Gestion du stress",
  author: "Thierry Da Silva",
  robots: "index, follow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};

const page = () => {
  return (
    <>
      <NoScript />

      <main className={styles.coaching}>
        <div className={styles.coaching__bg}>
          <Image
            className={styles.coaching__bg__img}
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            src={"/assets/test/sunlight2.webp"}
            alt="bousole"
          />
        </div>

        <section className={styles.coaching__type}>
          <h1 className={`${styles.coaching__type__h2}`}>
            Les différents types de coaching
          </h1>
          <div className={styles.coaching__type__content}>
            <div>
              <CardType
                title="Famille"
                content="Vous êtes soumis au rythme effréné de la vie, au stress, à la
                  fatigue quotidienne, au tempérament imprévisible des enfants
                  et aux enjeux autour de la scolarité qui rendent votre tâche
                  de parent particulièrement délicate."
                type="famille"
              />

              <CardType
                title="Professionnel"
                content="Soumis à des objectifs chiffrés, des procédures rigides et des
                réorganisations fréquentes, les salariés considèrent souvent
                que leur travail perd son sens. Alors peut se poser la
                question d’une réorientation ou d’une reconversion
                professionnelle."
                type="pro"
              />
            </div>
            <CardType
              title="Couple"
              content="La vie de couple est l’espace où chacun laisse éclore ce qu’il a
                de plus fragile et délicat. Il est le territoire où nous pouvons
                révéler sans crainte nos faiblesses comme nos forces. Tous les
                couples, à un moment ou à un autre, vivent des moments agréables
                et des moments plus difficiles. Un couple est la réunion de deux
                personnes qui ont chacune une histoire, des valeurs, des
                croyances, des envies qui leur sont propres. La rencontre de ces
                deux cultures nécessite un partage, des ajustements, des
                concessions de part et d’autre. Ce travail n’est pas toujours
                simple à réaliser."
              type="couple"
            />
          </div>
        </section>
        <section className={styles.coaching__help}>
          <h2 className={`${styles.coaching__help__h2}`}>
            Les objectifs
            <br /> d&apos;un coaching de vie
          </h2>
          <p className={styles.coaching__help__p}>
            Si vous cherchez à renforcer, améliorer et réparer les dynamiques
            opérant au sein de la famille, du couple et sur le plan
            professionnel, le coaching peut vous aider à :
          </p>
          <div className={styles.coaching__help__container}>
            <CardHelp title="Surmonter une difficulté ou un blocage" />
            <CardHelp title="Prendre une décision importante" />
            <CardHelp title="Trouver sa voie personnelle" />
            <CardHelp title="Vivre le changement" />
            <CardHelp title="S’accomplir dans la durée" />
            <CardHelp title="Profiter pleinement du temps retrouvé" />
            <CardHelp title="Trouver sa voie professionnelle" />
            <CardHelp
              title="Trouver un emploi en accord avec son potentiel et ses
                motivations"
            />
            <CardHelp title="Concrétiser son potentiel et réaliser ses objectifs" />
            <CardHelp title="Réussir et s’affirmer dans sa fonction" />
            <CardHelp title="Piloter son évolution de carrière et sa reconversion" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default page;
