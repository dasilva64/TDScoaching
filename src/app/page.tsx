import styles from "./page.module.scss";
import ImageDisplay from "./components/image/image";

export default function Home() {
  return (
    <main className={styles.home}>
      <h1 className={styles.home__h1}>Coaching de vie</h1>
      <div className={styles.home__container}>
        <div className={styles.home__article}>
          <h2 className={styles.home__article__h2}>
            Vous êtes en quête de bien-être ? Le coaching de vie peut vous
            apporter des solutions.
          </h2>
          <div className={styles.home__div__flex}>
            <div className={styles.home__divP__little}>
              <p>
                Le coaching est l’accompagnement d’une personne dans un
                processus de changement. Le coach agit comme facilitateur de
                l’évolution. Il apporte une vision extérieure, prend le rôle
                d’un partenaire objectif et permet à la personne coachée
                d’atteindre ses objectifs plus efficacement et plus rapidement.
              </p>
            </div>
            <div className={styles.home__divImg}>
              <ImageDisplay
                path={"/assets/img/avenue.jpg"}
                className={"right"}
                border={"20px"}
              />
            </div>
          </div>
        </div>
        <div className={styles.home__article}>
          <h2 className={styles.home__article__h2}>
            Coacher une personne, c’est quoi ?
          </h2>
          <div className={styles.home__div__flex}>
            <div className={styles.home__divImg}>
              <ImageDisplay
                path={"/assets/img/avenue.jpg"}
                className={"left"}
                border={"20px"}
              />
            </div>
            <div className={styles.home__divP__little}>
              <p>
                Coacher quelqu’un, c’est libérer son potentiel pour maximiser
                ses performances. C’est l’aider à apprendre plutôt que de lui
                enseigner.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.home__article}>
          <h2 className={styles.home__article__h2}>
            Le coaching de vie, c’est quoi ?
          </h2>
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
              Le coaching permet de prendre le temps de se poser ou mieux gérer
              son temps, de réfléchir, de se (re) trouver, de se (re) connaître,
              de s’orienter, de prendre des décisions, d’équilibrer ses domaines
              de vie, de communiquer plus facilement avec autrui, de mieux
              équilibrer sa vie professionnelle et sa vie privée et de manière
              générale de <strong>vivre mieux</strong>.
            </p>
            <p>
              tds-cochingdevie vous accompagne sur toutes formes de problèmes,
              dans différents domaines :
            </p>
            <p>
              L’accompagnement dans un divorce, rencontrer quelqu’un, apprendre
              à gérer son temps, optimiser son image, prendre soin de soi (avec
              un objectif minceur), vaincre sa timidité, oser être soi-même,
              affronter ses peurs, gagner en confiance, avoir une meilleure
              estime de soi, apprendre à dire NON, poser des limites, optimiser
              sa recherche d’emploi, mieux se connaitre pour vivre en adéquation
              avec ses valeurs, oser prendre la parole en public, mieux gérer
              son stress, aider dans la prise de décision, bien gérer ses
              émotions, mettre en place une parentalité positive et
              bienveillante, aider les parents à aider leurs enfants, gérer les
              adolescents, mettre en place une bonne communication, bien réagir
              face aux crises des enfants, répartir les tâches quotidiennes,
              savoir rester calme, etc.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
