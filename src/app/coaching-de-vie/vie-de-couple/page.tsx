import WhileInView from "@/app/components/framer/WhileInView";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";

const Couple = () => {
  return (
    <main className={styles.couple}>
      <section className={styles.couple__bg}>
        <Image
          className={styles.couple__bg__img}
          width="0"
          height="400"
          sizes="100vw"
          priority={true}
          src={"/assets/img/avenue.jpg"}
          alt="bousole"
        />
      </section>
      <section className={styles.couple__why}>
        <div className={styles.couple__why__container}>
          <h2 className={styles.couple__why__container__h2}>Vie de couple</h2>
          <div className={styles.couple__why__container__content}>
            <div className={styles.couple__why__container__content__text}>
              <h2 className={styles.couple__why__container__content__h2}>
                Pourquoi faire du coaching familial ?
              </h2>
              <div>
                <p>
                  Le couple est l’espace où chacun laisse éclore ce qu’il a de
                  plus fragile et délicat. Il est le territoire où nous pouvons
                  révéler sans crainte nos faiblesses comme nos forces.
                </p>
                <p>
                  Tous les couples, à un moment ou à un autre, vivent des
                  moments agréables et des moments plus difficiles. Lors de ces
                  moments d’impasses ou de défis, certains couples décident soit
                  de :
                </p>
                <ul className={styles.couple__why__container__content__ul}>
                  <li>Se séparer ;</li>
                  <li>Continuer à lutter l’un contre l’autre ;</li>
                  <li>
                    Se résigner et « vivre avec la situation » sans jamais rien
                    régler ;
                  </li>
                  <li>Traverser l’impasse pour en sortir encore plus fort .</li>
                </ul>
              </div>
            </div>

            <div className={styles.couple__why__container__content__card}>
              <Image
                className={styles.couple__why__container__content__card__img}
                width="0"
                height="0"
                sizes="100vw"
                priority={true}
                src={"/assets/img/couple.jpg"}
                alt="bousole"
              />
            </div>
          </div>
          <p>
            Les couples qui souhaitent vivre une vie amoureuse épanouie, saine
            et équilibrée choisissent de faire face à leur situation et de
            traverser l’impasse pour en sortir encore plus fort. L’un des moyens
            privilégiés des couples pour avoir l’aide ou l’accompagnement
            nécessaire aux changements souhaités est d’avoir recours à un coach
            conjugal.
          </p>
        </div>
      </section>
      <section className={styles.couple__how}>
        <div className={styles.couple__how__container}>
          <h2 className={styles.couple__how__container__h2}>
            Comment tds-coachingdevie peut vous aider ?
          </h2>
          <div className={styles.couple__how__container__content}>
            <div className={styles.couple__how__container__content__card}>
              <p className={styles.couple__how__container__content__card__p}>
                Accompagner le couple pour que chaque conjoint soit bienveillant
                envers l’autre – Aider à créer de l’harmonie dans le couple ;
              </p>
            </div>
            <div className={styles.couple__how__container__content__card}>
              <p className={styles.couple__how__container__content__card__p}>
                Accompagner le couple pour amener les conjoints à mieux
                communiquer (éviter les ruptures de dialogue, les
                incompréhensions et le mal-être) ;
              </p>
            </div>
            <div className={styles.couple__how__container__content__card}>
              <p className={styles.couple__how__container__content__card__p}>
                Coacher le couple pour solutionner les problématiques de
                tension, stress, disputes et frustrations ;
              </p>
            </div>
            <div className={styles.couple__how__container__content__card}>
              <p className={styles.couple__how__container__content__card__p}>
                Gérer les difficultés au sein d’une famille recomposée ;
              </p>
            </div>
            <div className={styles.couple__how__container__content__card}>
              <p className={styles.couple__how__container__content__card__p}>
                Accompagnement des couples en difficultés avec les enfants ;
              </p>
            </div>
            <div className={styles.couple__how__container__content__card}>
              <p className={styles.couple__how__container__content__card__p}>
                Gérer les difficultés liées aux changements de vie
                (déménagement, situation professionnelle, …) .
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.couple__delivery}>
        <div className={styles.couple__delivery__container}>
          <div className={styles.couple__delivery__container__card}>
            <h3 className={styles.couple__delivery__container__card__h3}>
              Mes prestations
            </h3>
            <Image
              className={styles.couple__delivery__container__card__img}
              width="30"
              height="30"
              priority={true}
              src={"/assets/icone/goal.png"}
              alt="bousole"
            />
            <p className={styles.couple__delivery__container__card__p}>
              Si vous souhaitez en savoir plus sur la tarification, cliquez sur
              le bouton ci-dessous.
            </p>
            <Link
              className={styles.couple__delivery__container__card__btn}
              href="/tarif"
            >
              Mes prestations
            </Link>
          </div>
          <div className={styles.couple__delivery__container__card}>
            <h3 className={styles.couple__delivery__container__card__h3}>
              Rendez-vous
            </h3>
            <Image
              className={styles.couple__delivery__container__card__img}
              width="30"
              height="30"
              priority={true}
              src={"/assets/icone/goal.png"}
              alt="bousole"
            />
            <p className={styles.couple__delivery__container__card__p}>
              Si vous souhaitez me contacter ou prendre rendez-vous, cliquez sur
              le bouton ci-dessous.
            </p>
            <Link
              className={styles.couple__delivery__container__card__btn}
              href="/contact"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Couple;
