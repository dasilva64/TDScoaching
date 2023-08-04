import WhileInView from "@/app/components/framer/WhileInView";
import ImageDisplay from "../../components/image/image";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";

const Pro = () => {
  return (
    <main className={styles.pro}>
      <WhileInView>
        <h1 className={styles.pro__h1}>Vie professionnelle</h1>
      </WhileInView>
      <div className={styles.pro__container}>
        <div className={styles.pro__article}>
          <WhileInView>
            <h2 className={styles.pro__article__h2}>
              Pourquoi faire du coaching professionnel ?
            </h2>
          </WhileInView>
          <div className={styles.pro__article__div}>
            <WhileInView className={styles.pro__article__div__text}>
              <div>
                <WhileInView>
                  <ul>
                    <li>
                      Vous êtes confrontés à l’ennui ou à la perte de sens ?
                    </li>
                    <li>
                      Vous souhaitez vous réorienter ou vous envisagez une
                      reconversion professionnelle ?
                    </li>
                    <li>
                      Vous souhaitez développer votre potentiel et vos
                      compétences ?
                    </li>
                  </ul>
                </WhileInView>
              </div>
            </WhileInView>
            <div className={styles.pro__article__div__img}>
              <WhileInView>
                <Image
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                    borderRadius: "20px",
                  }}
                  priority={true}
                  src={"/assets/img/laby.jpg"}
                  alt="bousole"
                />
              </WhileInView>
            </div>
          </div>
        </div>
        <div className={styles.pro__article}>
          <WhileInView>
            <h2 className={styles.pro__article__h2}>
              Comment tds-coachingdevie peut vous aider ?
            </h2>
          </WhileInView>
          <WhileInView className={styles.pro__article__big}>
            <div>
              <div>
                <WhileInView>
                  <p>
                    tds-coachingdevie vous accompagnera afin de vous permettre
                    de :
                  </p>
                </WhileInView>
                <WhileInView>
                  <ul className={styles.pro__article__big__ul}>
                    <li>Prendre du recul ;</li>
                    <li>Ouvrir le champ des possibles ;</li>
                    <li>Retrouver du sens et booster votre motivation ;</li>
                    <li>
                      Voir plus clairement les options qui s’offrent à vous ;
                    </li>
                    <li>Améliorer votre gestion du temps ;</li>
                    <li>Améliorer votre communication .</li>
                  </ul>
                </WhileInView>
              </div>
              <div>
                <WhileInView>
                  <p>
                    Je ne ferai pas les choses à votre place. Mon fil conducteur
                    sera toujours de viser votre <strong>autonomie</strong> et
                    votre développement personnel.
                  </p>
                </WhileInView>
              </div>
            </div>
          </WhileInView>
        </div>
        <div className={styles.pro__article}>
          <WhileInView>
            <p className={styles.pro__article__p__margin}>
              Si vous souhaitez en savoir plus sur la tarification, cliquez sur
              le bouton ci-dessous.
            </p>
          </WhileInView>
          <WhileInView>
            <p
              className={`${styles.pro__article__p} ${styles.pro__article__p__hover}`}
            >
              <Link className={styles.pro__article__btn} href="/tarif">
                Mes prestations
              </Link>
            </p>
          </WhileInView>
          <WhileInView>
            <p className={styles.pro__article__p}>
              Vous aimeriez que nous fassions un bout de chemin ensemble et que
              je vous accompagne afin de retrouver de l’harmonie et de la
              complicité au sein de votre pro ?
            </p>
          </WhileInView>
          <WhileInView>
            <p className={styles.pro__article__p}>
              Si vous souhaitez me contacter ou prendre rendez-vous, cliquez sur
              le bouton ci-dessous.
            </p>
          </WhileInView>
          <WhileInView>
            <p
              className={`${styles.pro__article__p} ${styles.pro__article__p__hover}`}
            >
              <Link className={styles.pro__article__btn} href="/contact">
                Prendre rendez-vous
              </Link>
            </p>
          </WhileInView>
        </div>
      </div>
    </main>
  );
};

export default Pro;
