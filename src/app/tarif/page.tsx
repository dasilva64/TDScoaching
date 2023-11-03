import Link from "next/link";
import WhileInView from "../components/framer/WhileInView";
import styles from "./page.module.scss";
import Image from "next/image";
import Button from "./components/Button";
import ButtonOpenDiscovery from "./components/ButtonOpenDiscovery";
import ButtonOpenNormal from "./components/ButtonOpenNormal";

const Tarif = () => {
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
      <main className={styles.tarif}>
        <section className={styles.tarif__bg}>
          <Image
            className={styles.tarif__bg__img}
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            src={"/assets/img/avenue.jpg"}
            alt="bousole"
          />
        </section>
        <section className={styles.tarif__packs}>
          <div className={styles.tarif__packs__head}>
            <div className={styles.tarif__packs__head__left}>
              <h1 className={styles.tarif__packs__head__left__h1}>Tarifs</h1>
              <p className={styles.tarif__packs__head__left__p}>
                Découvrez comment je peux vous accompagner vers l&apos;harmonie
                et l&apos;épanouissement.
              </p>
              <br />
              <p className={styles.tarif__packs__head__left__p}>
                {" "}
                Explorez mes offres et packs conçus sur mesure pour les couples,
                les familles et les professionnels, afin de transformer
                positivement votre vie personnelle et professionnelle.
              </p>
            </div>

            <div className={styles.tarif__packs__head__right}>
              <Image
                className={styles.tarif__packs__head__right__img}
                width="0"
                height="0"
                sizes="100vw"
                priority={true}
                src={"/assets/img/moi.jpeg"}
                alt="bousole"
              />
              <p className={styles.tarif__packs__head__right__p}>
                Les séances sont assurées par Thierry Da Silva, Coach
                professionnel certifié.
              </p>
            </div>
          </div>

          <div className={styles.tarif__packs__container}>
            <WhileInView
              type="y"
              className={`${styles.tarif__packs__container__card} ${styles.tarif__packs__container__card__unique}`}
            >
              <h2 className={styles.tarif__packs__container__card__h3}>
                Pack coaching unique
              </h2>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 entretien découverte offert ( <ButtonOpenDiscovery /> )
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 séances de coaching ( <ButtonOpenNormal />)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  Durée séance : 45mn / 1h
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  En distanciel (Visio)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  Sans engagement
                </li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                100
                <span
                  className={styles.tarif__packs__container__card__price__sign}
                >
                  €
                </span>
              </p>
              <div className={styles.tarif__packs__container__card__div}>
                <Button />
              </div>
            </WhileInView>
            <WhileInView
              type="y"
              className={`${styles.tarif__packs__container__card} ${styles.tarif__packs__container__card__flash}`}
            >
              <h2 className={styles.tarif__packs__container__card__h3}>
                Pack coaching flash
              </h2>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 entretien découverte offert ( <ButtonOpenDiscovery /> )
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  3 séances de coaching ( <ButtonOpenNormal />)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 bilan final offert
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  Durée séance : 45mn / 1h
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  En distanciel (Visio)
                </li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                300
                <span
                  className={styles.tarif__packs__container__card__price__sign}
                >
                  €
                </span>
              </p>
              <div className={styles.tarif__packs__container__card__div}>
                <Button />
              </div>
            </WhileInView>
            <WhileInView
              type="y"
              className={`${styles.tarif__packs__container__card} ${styles.tarif__packs__container__card__long}`}
            >
              <h2 className={styles.tarif__packs__container__card__h3}>
                Pack coaching long
              </h2>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 entretien découverte offert ( <ButtonOpenDiscovery /> )
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  10 séances de coaching ( <ButtonOpenNormal />)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 point d’étape offert (Après séance 5)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 bilan final offert
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  Durée séance : 45mn / 1h
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  En distanciel (Visio)
                </li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                1 000
                <span
                  className={styles.tarif__packs__container__card__price__sign}
                >
                  €
                </span>
              </p>
              <div className={styles.tarif__packs__container__card__div}>
                <Button />
              </div>
            </WhileInView>
            <WhileInView
              type="y"
              className={`${styles.tarif__packs__container__card} ${styles.tarif__packs__container__card__full}`}
            >
              <h2 className={styles.tarif__packs__container__card__h3}>
                Pack coaching full time
              </h2>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 entretien découverte offert ( <ButtonOpenDiscovery /> )
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  20 séances de coaching ( <ButtonOpenNormal />)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  2 points d’étape offerts (Après séances 7 et 14)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 bilan final offert
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  Durée séance : 45mn / 1h
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/asterisk-solid.svg"}
                    alt="bousole"
                  />
                  En distanciel (Visio)
                </li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                2 000
                <span
                  className={styles.tarif__packs__container__card__price__sign}
                >
                  €
                </span>
              </p>
              <div className={styles.tarif__packs__container__card__div}>
                <Button />
              </div>
            </WhileInView>
          </div>
        </section>
      </main>
    </>
  );
};

export default Tarif;
