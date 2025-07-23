import WhileInView from "../components/framer/WhileInView";
import styles from "./page.module.scss";
import Image from "../components/image/Image";
import Button from "./components/Button";
import ButtonOpenDiscovery from "./components/ButtonOpenDiscovery";
import ButtonOpenNormal from "./components/ButtonOpenNormal";

export const metadata = {
  title: "Coach de vie tarif - tdscoaching",
  description:
    "Explorez mes trois packs de coaching sur mesure pour les couples, les familles et les professionnels : pack unique, pack flash et pack sur mesure.",
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

import localFont from "next/font/local";
import NoScript from "../components/noscript/NoScript";
import Modal from "./components/modal/Modal";
import Footer from "../components/footer/footer";
import { ProviderTarif } from "../redux/provider/providerTarif";
const Parisienne = localFont({
  src: "../parisienne-regular-webfont.woff2",
  display: "swap",
});

const Tarif = () => {
  return (
    <>
    <ProviderTarif>
      <NoScript />
      <Modal />
      <main className={styles.tarif}>
        <div className={styles.tarif__bg}>
          <Image
            className={styles.tarif__bg__img}
            sizes="100vw"
            width="0"
            height="400"
            priority={true}
            src={"/assets/test/sunlight2.webp"}
            alt="Avenue dans une forêt"
          />
        </div>
        <div className={styles.tarif__packs}>
          <div className={styles.tarif__packs__head}>
            <section className={styles.tarif__packs__head__left}>
              <h1
                className={`${styles.tarif__packs__head__left__h1} ${Parisienne.className}`}
              >
                Tarifs
              </h1>
              <p className={styles.tarif__packs__head__left__p}>
                {" "}
                Explorez mes offres et packs conçus sur mesure pour les couples,
                les familles et les professionnels, afin de transformer
                positivement votre vie personnelle et professionnelle.
              </p>
              <p className={styles.tarif__packs__head__left__offer}>
                À l&apos;inscription vous aurez un rendez-vous de découverte
                offert <br />(<ButtonOpenDiscovery />)
              </p>
            </section>

            <div className={styles.tarif__packs__head__right}>
              <Image
                className={styles.tarif__packs__head__right__img}
                width="0"
                height="0"
                sizes="100vw"
                priority={true}
                src={"/assets/img/moi21.webp"}
                alt="Thierry DA SILVA coach professionnel certifié"
              />
              <p className={styles.tarif__packs__head__right__p}>
                Les séances sont assurées par Thierry Da Silva, coach
                professionnel certifié.
              </p>
            </div>
          </div>

          <div className={styles.tarif__packs__container}>
            <WhileInView
              type="y"
              className={`${styles.tarif__packs__container__card} ${styles.tarif__packs__container__card__unique}`}
            >
              <h2
                className={`${styles.tarif__packs__container__card__h3} ${Parisienne.className}`}
              >
                Pack unique
              </h2>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="30"
                    height="30"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 séance de coaching <br />(<ButtonOpenNormal />)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="30"
                    height="30"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
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
              <h2
                className={`${styles.tarif__packs__container__card__h3} ${Parisienne.className}`}
              >
                Pack flash
              </h2>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="30"
                    height="30"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  3 séances de coaching <br />(<ButtonOpenNormal />)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="30"
                    height="30"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  1 bilan final offert
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
              <h2
                className={`${styles.tarif__packs__container__card__h3} ${Parisienne.className}`}
              >
                Pack sur mesure
              </h2>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="30"
                    height="30"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  Nombre de séances de coaching à définir (selon choix du client
                  et problématique abordée) <br />(<ButtonOpenNormal />)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="30"
                    height="30"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  Points d’étape offerts (en fonction de la durée totale du
                  coaching)
                </li>
                <li className={styles.tarif__packs__container__card__ul__li}>
                  <Image
                    className={
                      styles.tarif__packs__container__card__ul__li__icone
                    }
                    width="30"
                    height="30"
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
                    width="30"
                    height="30"
                    priority={true}
                    src={"/assets/icone/check-solid.svg"}
                    alt="bousole"
                  />
                  Prix sur demande
                </li>
              </ul>
              <div className={styles.tarif__packs__container__card__div}>
                <Button />
              </div>
            </WhileInView>
          </div>
        </div>
      </main>
      <Footer />
      </ProviderTarif>
    </>
  );
};

export default Tarif;
