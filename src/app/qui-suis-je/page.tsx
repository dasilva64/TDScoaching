import WhileInView from "../components/framer/WhileInView";
import styles from "./page.module.scss";
import Image from "next/image";

const About = () => {
  return (
    <main className={styles.about}>
      <WhileInView>
        <h1 className={styles.about__h1}>Qui suis-je ?</h1>
      </WhileInView>
      <div className={styles.about__container}>
        <p className={styles.about__img}>
          <WhileInView>
            <Image
              width="0"
              height="0"
              sizes="100vw"
              style={{
                objectFit: "contain",
                width: "100%",
                height: "auto",
                borderRadius: "50%",
              }}
              priority={true}
              src={"/assets/img/moi.jpg"}
              alt="bousole"
            />
          </WhileInView>
        </p>
        <WhileInView>
          <p className={styles.about__thierry}>Thierry Da Silva Seabra</p>
        </WhileInView>
        <div className={styles.about__article}>
          <WhileInView>
            <h2 className={styles.about__article__h2}>
              Mon parcours professionnel :
            </h2>
          </WhileInView>
          <WhileInView>
            <p className={styles.about__article__p}>
              Aux cours de 30 années passées dans le management des
              organisations au sein du ministère de la défense, j’ai développé
              des compétences qui m’ont permis de m’adapter continuellement à de
              nouvelles fonctions et de nouveaux environnements.
              <br />
              A la suite d’un travail personnel en psychothérapie,
              comportementalisme et psychanalyse, j’ai décidé d’engager une
              reconversion professionnelle dans le coaching.
              <br />
              Ayant obtenu une certification de coach de vie, j’accompagne
              aujourd’hui des personnes qui souhaitent prendre conscience de
              leurs forces et apprendre à se mobiliser dans un objectif de
              bien-être et de performance.
            </p>
          </WhileInView>
        </div>
        <div className={styles.about__article}>
          <WhileInView>
            <h2 className={styles.about__article__h2}>
              Ma vision du coaching :
            </h2>
          </WhileInView>
          <WhileInView>
            <p className={styles.about__article__p}>
              Chaque individu dispose au plus profond de lui des ressources
              nécessaires pour réussir à atteindre ses objectifs.
              <br />
              Un coach ne donne pas de conseils ni de solutions clef en main à
              son client. Il agit comme un révélateur des capacités et du
              potentiel latent chez le coaché.
              <br />
              Mon objectif est d’aider d’autres personnes à accéder à leur plein
              potentiel. Il s’agit de les encourager à accepter leurs
              responsabilités, à faire des choix qui mèneront à de plus hauts
              niveaux de réalisation personnelle. Mon travail d’accompagnement
              consiste à aider mes clients, de les encourager à atteindre leurs
              objectifs et vivre la vie qu’ils désirent.
              <br />
              J’aide mon client à analyser sa situation actuelle, à établir
              l’itinéraire des différentes étapes nécessaires à l’atteinte de
              ses objectifs, en tenant compte de ses obstacles.
              <br />
              Le coaching est pour moi une véritable activité humaine
              passionnante où je mets tout mon savoir-faire dans un
              accompagnement sans jugements ni critiques.
            </p>
          </WhileInView>
        </div>
        <div className={styles.about__article}>
          <WhileInView>
            <h2 className={styles.about__article__h2}>Formations :</h2>
          </WhileInView>
          <WhileInView>
            <ul className={styles.about__article__ul}>
              <li>Certificat de coach professionnel – International NLP</li>
              <li>
                Certificat de formation en mémoire, concentration et créativité
                – Formalis – Accréditation IPHM et Qualiopi
              </li>
              <li>
                Certificat de formation en coaching de vie – Formalis –
                Accréditation IPHM et Qualiopi
              </li>
              <li>
                Certificat de formation en coaching parental – Formalis –
                Accréditation IPHM et Qualiopi
              </li>
              <li>
                Certificat de formation en coaching conjugal – Formalis –
                Accréditation IPHM et Qualiopi
              </li>
              <li>
                DESS Certificat d’aptitude à l’administration des entreprises –
                Université Paris 1-Panthéon Sorbonne
              </li>
              <li>
                Master of Business Administration (MBA) – IAE Paris – Université
                Paris 1-Panthéon Sorbonne
              </li>
            </ul>
          </WhileInView>
        </div>
      </div>
    </main>
  );
};

export default About;
