import styles from "./page.module.scss";
import Image from "next/image";
import WhileInView from "./components/framer/WhileInView";

export default function Home() {
  return (
    <main className={styles.home}>
      <div className={styles.home__bg}>
        <Image
          className={styles.home__bg__img}
          width="0"
          height="0"
          sizes="100vw"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          priority={true}
          src={"/assets/img/moi.jpeg"}
          alt="bousole"
        />
        <div className={styles.home__bg__div}>
          <h2 className={styles.home__bg__div__h2}>
            Vous êtes en quête de bien-être ? Le coaching de vie peut vous
            apporter des solutions.
          </h2>
          <p className={styles.home__bg__div__p}>
            Je coach les personnes qui souhaitent améliorer leur vie, qui
            souhaitent se sentir mieux, qui souhaitent être plus heureuses, qui
            souhaitent être plus épanouies, qui souhaitent être plus sereines,
            qui souhaitent être plus confiantes, qui souhaitent être plus
            équilibrées.
          </p>
          <div className={styles.home__bg__div__div}>
            <button className={styles.home__bg__div__div__btn}>
              Voir les offres
            </button>
          </div>
        </div>
      </div>

      <div className={styles.home__container}>
        <div className={styles.home__article}>
          <WhileInView>
            <h2 className={styles.home__article__h2}>
              Vous êtes en quête de bien-être ? Le coaching de vie peut vous
              apporter des solutions.
            </h2>
          </WhileInView>
          <p>
            Dans notre société moderne, il est facile de se sentir submergé par
            les multiples responsabilités, les pressions constantes et les
            attentes élevées auxquelles nous sommes confrontés. Que ce soit dans
            nos relations personnelles, au sein de notre famille ou dans notre
            parcours professionnel, il est naturel de désirer un état de
            bien-être et de sérénité. Cependant, la réalité est que souvent, ces
            aspirations se perdent dans le tumulte de la vie quotidienne. C'est
            ici que le coaching de vie entre en jeu en tant que phare guidant à
            travers les eaux troubles. Imaginez avoir un partenaire dédié, un
            professionnel qualifié, qui vous aide à démêler les nœuds
            émotionnels, à identifier les schémas négatifs qui entravent votre
            progression et à concevoir une feuille de route personnalisée vers
            la tranquillité que vous cherchez. Le coaching de vie se révèle être
            bien plus qu'une simple consultation : c'est une relation
            d'accompagnement où votre coach est investi dans votre
            transformation personnelle.
          </p>
          <div className={styles.home__div__flex}>
            <WhileInView className={styles.home__divP__little}>
              <div className={styles.home__divP__little__div}>
                <h3 className={styles.home__divP__little__div__h3}>
                  Coacher une personne, c’est quoi ?
                </h3>
                <p>
                  Coacher quelqu’un, c’est libérer son potentiel pour maximiser
                  ses performances. C’est l’aider à apprendre plutôt que de lui
                  enseigner. Le coaching de vie implique également de fournir
                  des outils et des techniques spécifiques pour vous aider à
                  surmonter les obstacles et à atteindre vos objectifs.
                </p>
              </div>
            </WhileInView>
            <div className={styles.home__divImg}>
              <WhileInView>
                <Image
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "auto",
                    borderRadius: "20px",
                  }}
                  priority={true}
                  src={"/assets/img/avenue.jpg"}
                  alt="bousole"
                />
              </WhileInView>
            </div>
          </div>
        </div>
        <div className={styles.home__article}>
          <WhileInView>
            <h2 className={styles.home__article__h2}>
              Le coaching de vie, c’est quoi ?
            </h2>
          </WhileInView>
          <WhileInView>
            <div className={styles.home__divP__big}>
              <p>
                Le coaching de vie s’est largement développé à partir des années
                1990 et couvre tous les domaines de la vie :
              </p>
              <ul className={styles.home__article__ul}>
                <li>Vie familiale</li>
                <li>Vie professionnelle</li>
                <li>Vie de couple</li>
                <li>Vie liée à l’épanouissement personnel</li>
                <li>Vie sociale</li>
              </ul>
              <p>
                Le coaching permet de prendre le temps de se poser ou mieux
                gérer son temps, de réfléchir, de se (re) trouver, de se (re)
                connaître, de s’orienter, de prendre des décisions, d’équilibrer
                ses domaines de vie, de communiquer plus facilement avec autrui,
                de mieux équilibrer sa vie professionnelle et sa vie privée et
                de manière générale de <strong>vivre mieux</strong>.
              </p>
              <p>
                tds-cochingdevie vous accompagne sur toutes formes de problèmes,
                dans différents domaines :
              </p>
              <p>
                L’accompagnement dans un divorce, rencontrer quelqu’un,
                apprendre à gérer son temps, optimiser son image, prendre soin
                de soi (avec un objectif minceur), vaincre sa timidité, oser
                être soi-même, affronter ses peurs, gagner en confiance, avoir
                une meilleure estime de soi, apprendre à dire NON, poser des
                limites, optimiser sa recherche d’emploi, mieux se connaitre
                pour vivre en adéquation avec ses valeurs, oser prendre la
                parole en public, mieux gérer son stress, aider dans la prise de
                décision, bien gérer ses é, mettre en place une parentalité
                positive et bienveillante, aider les parents à aider leurs
                enfants, gérer les adolescents, mettre en place une bonne
                communication, bien réagir face aux crises des enfants, répartir
                les tâches quotidiennes, savoir rester calme, etc.
              </p>
            </div>
          </WhileInView>
        </div>
        <div className={styles.home__article}>
          <WhileInView>
            <h2 className={styles.home__article__h2}>
              Quel est votre objectif ?
            </h2>
          </WhileInView>
          <WhileInView>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gridGap: "50px",
              }}
            >
              <div
                style={{
                  background: "beige",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3>Energie a l'état pur</h3>
                <p>
                  J'ai besion de me rebooster pour me sentir à nouveau en pleine
                  forme et retoruver ma motivation
                </p>
              </div>
              <div
                style={{
                  background: "beige",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3>Se reconstruire</h3>
                <p>
                  Je désire repartir de l'avant après une période difficile ou
                  un échec pour mieux accepter la situation, retrouver ma paix
                  intérieure et ma joie de vivre.
                </p>
              </div>
              <div
                style={{
                  background: "beige",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3>Trouver sa voie</h3>
                <p>
                  J'ai envie de mieux me connaitre pour définir un projet qui me
                  corresponde et dans lequel je m'épanouirai pleinement.
                </p>
              </div>
            </div>
          </WhileInView>
        </div>
      </div>
    </main>
  );
}
