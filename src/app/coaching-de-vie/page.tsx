import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import WhileInView from "../components/framer/WhileInView";

const page = () => {
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
      <main className={styles.coaching}>
        <section className={styles.coaching__bg}>
          <Image
            className={styles.coaching__bg__img}
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            src={"/assets/img/avenue.jpg"}
            alt="bousole"
          />
        </section>

        <section className={styles.coaching__type}>
          <h2 className={styles.coaching__type__h2}>
            Les différents types de coaching
          </h2>
          <div className={styles.coaching__type__content}>
            <div>
              <WhileInView
                type="y"
                className={`${styles.coaching__type__content__div} ${styles.coaching__type__content__div__margin}`}
              >
                <h3 className={styles.coaching__type__content__div__h3}>
                  Famille
                </h3>
                <p className={styles.coaching__type__content__div__p}>
                  Vous êtes soumis au rythme effréné de la vie, au stress, à la
                  fatigue quotidienne, au tempérament imprévisible des enfants
                  et aux enjeux autour de la scolarité qui rendent votre tâche
                  de parent particulièrement délicate.
                </p>
              </WhileInView>
              <WhileInView
                type="y"
                className={styles.coaching__type__content__div}
              >
                <h3 className={styles.coaching__type__content__div__h3}>
                  Professionnel
                </h3>
                <p className={styles.coaching__type__content__div__p}>
                  Soumis à des objectifs chiffrés, des procédures rigides et des
                  réorganisations fréquentes, les salariés considèrent souvent
                  que leur travail perd son sens. Alors peut se poser la
                  question d’une réorientation ou d’une reconversion
                  professionnelle.
                </p>
              </WhileInView>
            </div>

            <WhileInView
              type="y"
              className={styles.coaching__type__content__div}
            >
              <h3 className={styles.coaching__type__content__div__h3}>
                Couple
              </h3>
              <p className={styles.coaching__type__content__div__p}>
                La vie de couple est l’espace où chacun laisse éclore ce qu’il a
                de plus fragile et délicat. Il est le territoire où nous pouvons
                révéler sans crainte nos faiblesses comme nos forces. Tous les
                couples, à un moment ou à un autre, vivent des moments agréables
                et des moments plus difficiles. Un couple est la réunion de deux
                personnes qui ont chacune une histoire, des valeurs, des
                croyances, des envies qui leur sont propres. La rencontre de ces
                deux cultures nécessite un partage, des ajustements, des
                concessions de part et d’autre. Ce travail n’est pas toujours
                simple à réaliser.
              </p>
            </WhileInView>
          </div>
        </section>
        <section className={styles.coaching__help}>
          <p className={styles.coaching__help__p}>
            Si vous cherchez à renforcer, améliorer et réparer les dynamiques
            opérant au sein de la famille, du couple et sur le plan
            professionnel, le coaching peut vous aider à :
          </p>
          <div className={styles.coaching__help__container}>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Surmonter une difficulté ou un blocage
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Prendre une décision importante
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Trouver sa voie personnelle
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Vivre le changement
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                S’accomplir dans la durée
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Profiter pleinement du temps retrouvé
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Trouver sa voie professionnelle
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Trouver un emploi en accord avec son potentiel et ses
                motivations
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Concrétiser son potentiel et réaliser ses objectifs
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Réussir et s’affirmer dans sa fonction
              </h3>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__help__container__div}
            >
              <h3 className={styles.coaching__help__container__div__h3}>
                Piloter son évolution de carrière et sa reconversion
              </h3>
            </WhileInView>
          </div>
        </section>
        <section className={styles.coaching__delivery}>
          <div className={styles.coaching__delivery__container}>
            <WhileInView
              type="y"
              className={styles.coaching__delivery__container__card}
            >
              <h3 className={styles.coaching__delivery__container__card__h3}>
                Mes prestations
              </h3>
              <Image
                className={styles.coaching__delivery__container__card__img}
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/goal.png"}
                alt="bousole"
              />
              <p className={styles.coaching__delivery__container__card__p}>
                Si vous souhaitez en savoir plus sur la tarification, cliquez
                sur le bouton ci-dessous.
              </p>
              <Link
                className={styles.coaching__delivery__container__card__btn}
                href="/tarif"
              >
                Mes prestations
              </Link>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.coaching__delivery__container__card}
            >
              <h3 className={styles.coaching__delivery__container__card__h3}>
                Rendez-vous
              </h3>
              <Image
                className={styles.coaching__delivery__container__card__img}
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/goal.png"}
                alt="bousole"
              />
              <p className={styles.coaching__delivery__container__card__p}>
                Si vous souhaitez me contacter ou prendre rendez-vous, cliquez
                sur le bouton ci-dessous.
              </p>
              <Link
                className={styles.coaching__delivery__container__card__btn}
                href="/contact"
              >
                Prendre rendez-vous
              </Link>
            </WhileInView>
          </div>
        </section>
      </main>
    </>
  );
};

export default page;
