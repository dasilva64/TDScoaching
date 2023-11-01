import Link from "next/link";
import WhileInView from "../components/framer/WhileInView";
import styles from "./page.module.scss";
import Image from "next/image";

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
          <h1 className={styles.tarif__packs__h1}>Offres packs</h1>
          <div className={styles.tarif__packs__container}>
            <WhileInView
              type="y"
              className={styles.tarif__packs__container__card}
            >
              <h3 className={styles.tarif__packs__container__card__h3}>
                Pack coaching unique
              </h3>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li>1 entretien découverte offert</li>
                <li>1 séances de coaching</li>
                <li>1 bilan final offert</li>
                <li>Durée séance : 45mn / 1h</li>
                <li>En distanciel (Visio)</li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                80 euros
              </p>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.tarif__packs__container__card}
            >
              <h3 className={styles.tarif__packs__container__card__h3}>
                Pack coaching flash
              </h3>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li>1 entretien découverte offert</li>
                <li>3 séances de coaching</li>
                <li>1 bilan final offert</li>
                <li>Durée séance : 45mn / 1h</li>
                <li>En distanciel (Visio)</li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                300 euros
              </p>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.tarif__packs__container__card}
            >
              <h3 className={styles.tarif__packs__container__card__h3}>
                Pack coaching long
              </h3>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li>1 entretien découverte offert</li>
                <li>10 séances de coaching</li>
                <li>1 point d’étape offert (Après séance 5)</li>
                <li>1 bilan final offert</li>
                <li>Durée séance : 45mn / 1h</li>
                <li>En distanciel (Visio)</li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                1 000 euros
              </p>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.tarif__packs__container__card}
            >
              <h3 className={styles.tarif__packs__container__card__h3}>
                Pack coaching full time
              </h3>
              <ul className={styles.tarif__packs__container__card__ul}>
                <li>1 entretien découverte offert</li>
                <li>20 séances de coaching</li>
                <li>2 points d’étape offerts (Après séances 7 et 14)</li>
                <li>1 bilan final offert</li>
                <li>Durée séance : 45mn / 1h</li>
                <li>En distanciel (Visio)</li>
              </ul>
              <p className={styles.tarif__packs__container__card__price}>
                2 000 euros
              </p>
            </WhileInView>
          </div>
        </section>
        <section className={styles.tarif__modalite}>
          <div className={styles.tarif__modalite__container}>
            <h2 className={styles.tarif__modalite__container__h2}>
              Modalités pratiques
            </h2>
            <div className={styles.tarif__modalite__container__content}>
              <p className={styles.tarif__modalite__container__content__p}>
                La relation entre le coaché et le coach est essentielle. Le
                coach est un partenaire qui éclaire votre chemin et vous apporte
                de la motivation. L’accompagnement du coach est une véritable
                collaboration au sein de laquelle sera mis en œuvre votre
                changement.
                <br />
                Choisir un coach compétent et respectueux de votre personne est
                donc absolument essentiel. Un coach compétent est
                un professionnel qui pratique judicieusement et avec humanité
                l’art du questionnement et de l’accompagnement.
                <br />
                Si aujourd’hui cette profession n’est pas règlementée, il n’en
                reste pas moins important que le coach doit avoir été formé au
                préalable à tout exercice.
                <br />
                L’accréditation ICF (Fédération internationale de coaching) est
                un gage de sérieux et de qualité.
                <br />
                Parce que la population est de plus en plus exigeante, ICF a
                défini une charte qualité adoptée par tous ses coachs, qui
                permet aux personnes coachées de maximiser leur potentiel et
                d’atteindre leurs objectifs.
                <br />
                Elle a également mis en place 1 processus de certification
                unique et commun à tous les pays.
                <br />
                Les coachs doivent renouveler leur certification tous les 3 ans,
                attestant leur formation continue.
              </p>
            </div>
          </div>
        </section>
        <section className={styles.tarif__discovery}>
          <div className={styles.tarif__discovery__container}>
            <h2 className={styles.tarif__discovery__container__h2}>
              Première séance : Découverte
            </h2>
            <div className={styles.tarif__discovery__container__content}>
              <p className={styles.tarif__discovery__container__content__p}>
                Le coaching débutera par une première séance dite de «
                découverte ». Il s’agit d’une séance de rencontre de 30 à 45
                minutes qui est le point de départ de tout travail en coaching.
                Elle a notamment pour but de faire connaissance, d’évaluer la
                problématique du coaché et de s’assurer qu’elle est du domaine
                de compétence du coaching. A ce stade, le coach pourra orienter
                le coaché vers d’autres professionnels si nécessaire.
              </p>
            </div>
          </div>
        </section>
        <section className={styles.tarif__next}>
          <div className={styles.tarif__next__container}>
            <h2 className={styles.tarif__next__container__h2}>
              Séances suivantes :
            </h2>
            <div className={styles.tarif__next__container__content}>
              <p className={styles.tarif__next__container__content__p}>
                Ensuite, le véritable travail de coaching commence. Les séances
                de coaching dureront entre 45mn et 1h et seront généralement
                espacées de 2 semaines. Elles permettront de prendre conscience
                du fonctionnement actuel et des blocages.
                <br />
                Vous choisirez un objectif (c’est-à-dire ce sur quoi vous
                souhaitez avancer) qui soit clairement mesurable, contextualisé
                et ne dépendant que de vous. En fonction de votre demande, des
                axes de travail vont apparaître. Vous établirez un plan
                d’actions concrètes pour activer le changement. Nous fixerons
                ensemble le rythme et le cadre des séances. La durée du coaching
                est variable en fonction du travail que vous souhaiterez
                réaliser.
                <br />
                Tout au long des rencontres, nous échangerons sur votre
                accompagnement et sur le processus en cours. Au fur et à mesure,
                vous explorerez de nouvelles pistes et de nouvelles méthodes
                pour aborder les difficultés rencontrées. Le coaching vous
                permettra de prendre conscience de votre potentiel et vous
                aidera à atteindre votre objectif. Le coaching se terminera
                toujours par une séance de « clôture » permettant de valider
                l’atteinte de l’objectif.
                <br />
                Toutes les séances auront lieu en visio avec des outils dédiés.
                Vous n’aurez aucun logiciel à installer.
              </p>
            </div>
          </div>
        </section>
        <section className={styles.tarif__delivery}>
          <div className={styles.tarif__delivery__container}>
            <WhileInView
              type="y"
              className={styles.tarif__delivery__container__card}
            >
              <h3 className={styles.tarif__delivery__container__card__h3}>
                Mes prestations
              </h3>
              <Image
                className={styles.tarif__delivery__container__card__img}
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/goal.png"}
                alt="bousole"
              />
              <p className={styles.tarif__delivery__container__card__p}>
                Si vous souhaitez en savoir plus sur la tarification, cliquez
                sur le bouton ci-dessous.
              </p>
              <Link
                className={styles.tarif__delivery__container__card__btn}
                href="/tarif"
              >
                Mes prestations
              </Link>
            </WhileInView>
            <WhileInView
              type="y"
              className={styles.tarif__delivery__container__card}
            >
              <h3 className={styles.tarif__delivery__container__card__h3}>
                Rendez-vous
              </h3>
              <Image
                className={styles.tarif__delivery__container__card__img}
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/goal.png"}
                alt="bousole"
              />
              <p className={styles.tarif__delivery__container__card__p}>
                Si vous souhaitez me contacter ou prendre rendez-vous, cliquez
                sur le bouton ci-dessous.
              </p>
              <Link
                className={styles.tarif__delivery__container__card__btn}
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

export default Tarif;
