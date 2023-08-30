import Link from "next/link";
import styles from "./page.module.scss";
import WhileInView from "@/app/components/framer/WhileInView";
import Image from "next/image";

const Famille = () => {
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
      <main className={styles.famille}>
        <section className={styles.famille__bg}>
          <Image
            className={styles.famille__bg__img}
            width="0"
            height="400"
            sizes="100vw"
            priority={true}
            src={"/assets/img/avenue.jpg"}
            alt="bousole"
          />
        </section>
        <section className={styles.famille__why}>
          <div className={styles.famille__why__container}>
            <h2 className={styles.famille__why__container__h2}>
              Vie familiale
            </h2>
            <div className={styles.famille__why__container__content}>
              <div className={styles.famille__why__container__content__text}>
                <h2 className={styles.famille__why__container__content__h2}>
                  Pourquoi faire du coaching familial ?
                </h2>
                <p>
                  Pour renforcer, améliorer et réparer les dynamiques opérant au
                  sein de la famille.
                  <br />
                  Vous êtes soumis au rythme effréné de la vie, au stress, à la
                  fatigue quotidienne, au tempérament imprévisible des enfants
                  et aux enjeux autour de la scolarité qui rendent votre tâche
                  de parent particulièrement délicate.
                </p>
              </div>
              <div className={styles.famille__why__container__content__card}>
                <Image
                  className={styles.famille__why__container__content__card__img}
                  width="0"
                  height="0"
                  sizes="100vw"
                  priority={true}
                  src={"/assets/img/famille.jpg"}
                  alt="bousole"
                />
              </div>
            </div>
          </div>
        </section>
        <section className={styles.famille__how}>
          <div className={styles.famille__how__container}>
            <h2 className={styles.famille__how__container__h2}>
              Comment tds-coachingdevie peut vous aider ?
            </h2>
            <div className={styles.famille__how__container__content}>
              <div className={styles.famille__how__container__content__card}>
                <p className={styles.famille__how__container__content__card__p}>
                  Accompagner les parents isolés à devenir leader de leurs
                  enfants ;
                </p>
              </div>
              <div className={styles.famille__how__container__content__card}>
                <p className={styles.famille__how__container__content__card__p}>
                  Accompagner les parents à développer leurs qualités de
                  communication (Ecoute, compréhension, respect de chacun) ;
                </p>
              </div>
              <div className={styles.famille__how__container__content__card}>
                <p className={styles.famille__how__container__content__card__p}>
                  Coacher les femmes entrepreneures à équilibrer leur vie de
                  maman et leur vie professionnelle ;
                </p>
              </div>
              <div className={styles.famille__how__container__content__card}>
                <p className={styles.famille__how__container__content__card__p}>
                  Aider les parents à obtenir des relations complices avec leurs
                  enfants sans avoir à crier ni s’énerver ;
                </p>
              </div>
              <div className={styles.famille__how__container__content__card}>
                <p className={styles.famille__how__container__content__card__p}>
                  Aider les beaux-parents qui ne se sentent pas reconnus à
                  trouver leur place su sein de la famille recomposée ;
                </p>
              </div>
              <div className={styles.famille__how__container__content__card}>
                <p className={styles.famille__how__container__content__card__p}>
                  Aider les mamans hypersensibles à se sentir épanouies malgré
                  leurs émotions débordantes .
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.famille__what}>
          <h2 className={styles.famille__what__h2}>
            Le coaching familial c’est :
          </h2>
          <div className={styles.famille__what__container}>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Des rencontres à domicile ou par vidéo ;
              </p>
            </div>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Une rencontre d’évaluation, afin de bien cerner les besoins et
                l’origine des difficultés ;
              </p>
            </div>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Une rencontre de clarification des objectifs, afin de prendre la
                bonne direction ;
              </p>
            </div>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Une ou plusieurs rencontres afin d’aider la famille à bâtir et
                appliquer un plan d’action concret ;
              </p>
            </div>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Une ou des rencontres d’observation et de coaching à travers le
                quotidien ;
              </p>
            </div>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Une intervention basée sur les approches systémiques, approches
                orientées vers les solutions, le coaching et la programmation
                neurolinguistique (PNL) ;
              </p>
            </div>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Une approche axée sur la responsabilisation de chaque membre de
                la famille, le développement du leadership éducatif des parents
                et des adultes qui guident l’enfant ;
              </p>
            </div>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Une intervention positive et respectueuse qui se base sur les
                forces et les ressources de chacun ;
              </p>
            </div>
            <div className={styles.famille__what__container__card}>
              <p className={styles.famille__what__container__card__p}>
                Une formule épanouissante qui permet de retrouver le juste
                équilibre entre fermeté et bienveillance .
              </p>
            </div>
          </div>
        </section>
        <section className={styles.famille__delivery}>
          <div className={styles.famille__delivery__container}>
            <div className={styles.famille__delivery__container__card}>
              <h3 className={styles.famille__delivery__container__card__h3}>
                Mes prestations
              </h3>
              <Image
                className={styles.famille__delivery__container__card__img}
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/goal.png"}
                alt="bousole"
              />
              <p className={styles.famille__delivery__container__card__p}>
                Si vous souhaitez en savoir plus sur la tarification, cliquez
                sur le bouton ci-dessous.
              </p>
              <Link
                className={styles.famille__delivery__container__card__btn}
                href="/tarif"
              >
                Mes prestations
              </Link>
            </div>
            <div className={styles.famille__delivery__container__card}>
              <h3 className={styles.famille__delivery__container__card__h3}>
                Rendez-vous
              </h3>
              <Image
                className={styles.famille__delivery__container__card__img}
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/goal.png"}
                alt="bousole"
              />
              <p className={styles.famille__delivery__container__card__p}>
                Si vous souhaitez me contacter ou prendre rendez-vous, cliquez
                sur le bouton ci-dessous.
              </p>
              <Link
                className={styles.famille__delivery__container__card__btn}
                href="/contact"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Famille;
