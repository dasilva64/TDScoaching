import WhileInView from "@/app/components/framer/WhileInView";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";

const Pro = () => {
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
      <main className={styles.pro}>
        <section className={styles.pro__bg}>
          <Image
            className={styles.pro__bg__img}
            width="0"
            height="400"
            sizes="100vw"
            priority={true}
            src={"/assets/img/avenue.jpg"}
            alt="bousole"
          />
        </section>
        <section className={styles.pro__why}>
          <div className={styles.pro__why__container}>
            <h2 className={styles.pro__why__container__h2}>
              Vie professionnelle
            </h2>
            <div className={styles.pro__why__container__content}>
              <div className={styles.pro__why__container__content__text}>
                <h2 className={styles.pro__why__container__content__h2}>
                  Pourquoi faire du coaching professionnel ?
                </h2>
                <div>
                  <p>
                    Vous êtes confrontés à l’ennui ou à la perte de sens ?
                    <br />
                    Vous souhaitez vous réorienter ou vous envisagez une
                    reconversion professionnelle ?
                    <br />
                    Vous souhaitez développer votre potentiel et vos compétences
                    ?
                  </p>
                </div>
              </div>
              <div className={styles.pro__why__container__content__card}>
                <Image
                  className={styles.pro__why__container__content__card__img}
                  width="0"
                  height="0"
                  sizes="100vw"
                  priority={true}
                  src={"/assets/img/laby.jpg"}
                  alt="bousole"
                />
              </div>
            </div>
          </div>
        </section>
        <section className={styles.pro__how}>
          <div className={styles.pro__how__container}>
            <h2 className={styles.pro__how__container__h2}>
              Comment tds-coachingdevie peut vous aider ?
            </h2>
            <div className={styles.pro__how__container__content}>
              <div className={styles.pro__how__container__content__card}>
                <p className={styles.pro__how__container__content__card__p}>
                  Prendre du recul ;
                </p>
              </div>
              <div className={styles.pro__how__container__content__card}>
                <p className={styles.pro__how__container__content__card__p}>
                  Ouvrir le champ des possibles ;
                </p>
              </div>
              <div className={styles.pro__how__container__content__card}>
                <p className={styles.pro__how__container__content__card__p}>
                  Retrouver du sens et booster votre motivation ;
                </p>
              </div>
              <div className={styles.pro__how__container__content__card}>
                <p className={styles.pro__how__container__content__card__p}>
                  Voir plus clairement les options qui s’offrent à vous ;
                </p>
              </div>
              <div className={styles.pro__how__container__content__card}>
                <p className={styles.pro__how__container__content__card__p}>
                  Améliorer votre gestion du temps ;
                </p>
              </div>
              <div className={styles.pro__how__container__content__card}>
                <p className={styles.pro__how__container__content__card__p}>
                  Améliorer votre communication .
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.pro__delivery}>
          <div className={styles.pro__delivery__container}>
            <div className={styles.pro__delivery__container__card}>
              <h3 className={styles.pro__delivery__container__card__h3}>
                Mes prestations
              </h3>
              <Image
                className={styles.pro__delivery__container__card__img}
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/goal.png"}
                alt="bousole"
              />
              <p className={styles.pro__delivery__container__card__p}>
                Si vous souhaitez en savoir plus sur la tarification, cliquez
                sur le bouton ci-dessous.
              </p>
              <Link
                className={styles.pro__delivery__container__card__btn}
                href="/tarif"
              >
                Mes prestations
              </Link>
            </div>
            <div className={styles.pro__delivery__container__card}>
              <h3 className={styles.pro__delivery__container__card__h3}>
                Rendez-vous
              </h3>
              <Image
                className={styles.pro__delivery__container__card__img}
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/goal.png"}
                alt="bousole"
              />
              <p className={styles.pro__delivery__container__card__p}>
                Si vous souhaitez me contacter ou prendre rendez-vous, cliquez
                sur le bouton ci-dessous.
              </p>
              <Link
                className={styles.pro__delivery__container__card__btn}
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

export default Pro;
