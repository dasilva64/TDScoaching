import styles from "./page.module.scss";
import Image from "next/image";
import WhileInView from "./components/framer/WhileInView";
import GoDown from "./components/goDown/goDown";
import Parallax from "./components/framer/parallax";

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
          <h1 className={styles.home__bg__div__h2}>Thierry Da Silva</h1>
          <p className={styles.home__bg__div__p}>
            Coach de vie certifié, je vous accompagne dans votre
          </p>
          <p className={styles.home__bg__div__p}>
            développement personnel et professionnel.
          </p>
          <div className={styles.home__bg__div__div}>
            <button className={styles.home__bg__div__div__btn}>
              Voir les offres
            </button>
          </div>
        </div>
        <GoDown />
      </div>

      <div className={styles.home__container} id="test">
        <div className={styles.home__article}>
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            <WhileInView>
              <h2
                className={styles.home__article__h2}
                style={{ marginTop: "20px" }}
              >
                Vous êtes en quête de bien-être ? Le coaching de vie peut vous
                apporter des solutions.
              </h2>
            </WhileInView>
            <p>
              Le coaching est l’accompagnement d’une personne dans un processus
              de changement. Le coach agit comme facilitateur de l’évolution. Il
              apporte une vision extérieure, prend le rôle d’un partenaire
              objectif et permet à la personne coachée d’atteindre ses objectifs
              plus efficacement et plus rapidement.
            </p>
            <div className={styles.home__div__flex}>
              <WhileInView className={styles.home__divP__little}>
                <div className={styles.home__divP__little__div}>
                  <h3 className={styles.home__divP__little__div__h3}>
                    Coacher une personne, c’est quoi ?
                  </h3>
                  <p>
                    Coacher quelqu’un, c’est libérer son potentiel pour
                    maximiser ses performances. C’est l’aider à apprendre plutôt
                    que de lui enseigner. Le coaching de vie implique également
                    de fournir des outils et des techniques spécifiques pour
                    vous aider à surmonter les obstacles et à atteindre vos
                    objectifs. Coacher quelqu’un, c’est libérer son potentiel
                    pour maximiser ses performances. C’est l’aider à apprendre
                    plutôt que de lui enseigner. Le coaching de vie implique
                    également de fournir des outils et des techniques
                    spécifiques pour vous aider à surmonter les obstacles et à
                    atteindre vos objectifs. Coacher quelqu’un, c’est libérer
                    son potentiel pour maximiser ses performances. C’est l’aider
                    à apprendre plutôt que de lui enseigner. Le coaching de vie
                    implique également de fournir des outils et des techniques
                    spécifiques pour vous aider à surmonter les obstacles et à
                    atteindre vos objectifs.
                  </p>
                </div>
              </WhileInView>
              <div className={styles.home__divImg}>
                <WhileInView>
                  <Image
                    width="400"
                    height="300"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "auto",
                      borderRadius: "10px",
                    }}
                    priority={true}
                    src={"/assets/img/avenue.jpg"}
                    alt="bousole"
                  />
                </WhileInView>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.home__article}
          style={{ background: "rgba(0, 0, 0, 0.02)" }}
        >
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            <WhileInView>
              <h2 className={styles.home__article__h2}>
                Le coaching de vie, c’est quoi ?
              </h2>
            </WhileInView>
            <WhileInView>
              <div className={styles.home__div__flex}>
                <div className={styles.home__divImg} style={{ flex: "1" }}>
                  <Image
                    width="500"
                    height="500"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      borderRadius: "10px",
                    }}
                    priority={true}
                    src={"/assets/img/avenue.jpg"}
                    alt="bousole"
                  />
                </div>
                <div
                  className={styles.home__divP__little}
                  style={{ flex: "1", marginLeft: "80px" }}
                >
                  <p>
                    Le coaching de vie s’est largement développé à partir des
                    années 1990 et couvre tous les domaines de la vie :
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
                    gérer son temps, de réfléchir, de se (re) trouver, de se
                    (re) connaître, de s’orienter, de prendre des décisions,
                    d’équilibrer ses domaines de vie, de communiquer plus
                    facilement avec autrui, de mieux équilibrer sa vie
                    professionnelle et sa vie privée et de manière générale de{" "}
                    <strong>vivre mieux</strong>.
                  </p>
                  <p>
                    tds-cochingdevie vous accompagne sur toutes formes de
                    problèmes, dans différents domaines :
                  </p>
                  <p>
                    L’accompagnement dans un divorce, rencontrer quelqu’un,
                    apprendre à gérer son temps, optimiser son image, prendre
                    soin de soi (avec un objectif minceur), vaincre sa timidité,
                    oser être soi-même, affronter ses peurs, gagner en
                    confiance, avoir une meilleure estime de soi, apprendre à
                    dire NON, poser des limites, optimiser sa recherche
                    d’emploi, mieux se connaitre pour vivre en adéquation avec
                    ses valeurs, oser prendre la parole en public, mieux gérer
                    son stress, aider dans la prise de décision, bien gérer ses
                    é, mettre en place une parentalité positive et
                    bienveillante, aider les parents à aider leurs enfants,
                    gérer les adolescents, mettre en place une bonne
                    communication, bien réagir face aux crises des enfants,
                    répartir les tâches quotidiennes, savoir rester calme, etc.
                  </p>
                </div>
              </div>
            </WhileInView>
          </div>
        </div>
        <div
          className={styles.home__article}
          style={{ marginLeft: "10%", marginRight: "10%" }}
        >
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
                  border: "1px solid orange",
                  boxShadow: "5px 5px 5px #5fc0ee",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ marginBottom: "30px" }}>Clarté et Objectifs</h3>
                <Image
                  style={{ float: "right", position: "relative", top: "-50px" }}
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/goal.png"}
                  alt="bousole"
                />
                <p>
                  Un coach de vie peut vous aider à définir des objectifs clairs
                  et significatifs dans les domaines qui comptent le plus pour
                  vous. Il vous guidera à travers un processus de réflexion
                  approfondie pour définir ce que vous voulez vraiment et
                  élaborer un plan pour y parvenir.
                </p>
              </div>
              <div
                style={{
                  border: "1px solid orange",
                  boxShadow: "5px 5px 5px #5fc0ee",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ marginBottom: "30px" }}>
                  Surmonter les Obstacles
                </h3>
                <Image
                  style={{ float: "right", position: "relative", top: "-50px" }}
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/difficulties.png"}
                  alt="bousole"
                />
                <p>
                  Les défis et les obstacles peuvent parfois sembler
                  insurmontables. Un coach de vie peut vous aider à identifier
                  les schémas négatifs de pensée et de comportement qui
                  entravent votre progression, et vous fournir des stratégies
                  pour les surmonter.
                </p>
              </div>
              <div
                style={{
                  border: "1px solid orange",
                  boxShadow: "5px 5px 5px #5fc0ee",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ marginBottom: "30px" }}>
                  Améliorer les Relations
                </h3>
                <Image
                  style={{ float: "right", position: "relative", top: "-50px" }}
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/relationships.png"}
                  alt="bousole"
                />
                <p>
                  Si vous avez des difficultés dans vos relations de couple,
                  votre famille ou vos relations professionnelles, un coach de
                  vie peut vous aider à améliorer la communication, à développer
                  des compétences en résolution de conflits et à renforcer les
                  liens.
                </p>
              </div>
              <div
                style={{
                  border: "1px solid orange",
                  boxShadow: "5px 5px 5px #5fc0ee",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ marginBottom: "30px" }}>Confiance en Soi</h3>
                <Image
                  style={{ float: "right", position: "relative", top: "-50px" }}
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/self-confident.png"}
                  alt="bousole"
                />
                <p>
                  Un manque de confiance en soi peut être un frein majeur à la
                  réalisation de vos objectifs. Un coach de vie peut vous aider
                  à reconnaître et à renforcer vos forces, à vous accepter tel
                  que vous êtes et à développer une confiance en vous solide.
                </p>
              </div>
              <div
                style={{
                  border: "1px solid orange",
                  boxShadow: "5px 5px 5px #5fc0ee",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ marginBottom: "30px" }}>Gestion du Stress</h3>
                <Image
                  style={{ float: "right", position: "relative", top: "-50px" }}
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/fear.png"}
                  alt="bousole"
                />
                <p>
                  La vie moderne peut être stressante. Un coach de vie peut vous
                  enseigner des techniques de gestion du stress, de relaxation
                  et de prise de recul pour mieux faire face aux défis de la vie
                  quotidienne.
                </p>
              </div>
              <div
                style={{
                  border: "1px solid orange",
                  boxShadow: "5px 5px 5px #5fc0ee",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ marginBottom: "30px" }}>Croissance Personnelle</h3>
                <Image
                  style={{ float: "right", position: "relative", top: "-50px" }}
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/diagram.png"}
                  alt="bousole"
                />
                <p>
                  Le coaching de vie vous pousse à sortir de votre zone de
                  confort et à vous engager dans un voyage de croissance
                  personnelle. Vous explorerez de nouvelles perspectives,
                  apprendrez à vous connaître plus en profondeur et développerez
                  un sentiment de réalisation personnelle.
                </p>
              </div>
            </div>
          </WhileInView>
        </div>
      </div>
    </main>
  );
}
