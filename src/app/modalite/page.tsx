import styles from "./page.module.scss"

const Modalite = () => {
  return (
    <main className={styles.modalite} >
    <h1 className={styles.modalite__h1}>Modalités des séances de coaching</h1>
    <div className={styles.modalite__container}>
      <div className={styles.modalite__article}>
        <div>
          <p className={styles.modalite__article__div}>
            La relation entre le coaché et le coach est essentielle. Le coach
            est un <strong>partenaire</strong> qui éclaire votre chemin et
            vous apporte de la motivation. L’accompagnement du coach est une
            véritable collaboration au sein de laquelle sera mis en œuvre
            votre changement.
            <br />
            Choisir un coach compétent et respectueux de votre personne est
            donc absolument essentiel. Un coach compétent est un{" "}
            <strong>professionnel</strong> qui pratique judicieusement et avec
            humanité l’art du questionnement et de l’accompagnement.
            <br />
            Si aujourd’hui cette profession n’est pas règlementée, il n’en
            reste pas moins important que le coach doit avoir été formé au
            préalable à tout exercice.
            <br />
            Il doit notamment lui-même être engagé dans un travail
            thérapeutique et dans une supervision, afin de ne prendre aucun
            risque de transfert de ses propres problématiques sur son client.
          </p>
        </div>
        <div>
          <h2 className={styles.modalite__article__h2}>Première séance : Découverte</h2>
          <p className={styles.modalite__article__div}>
            Le coaching débutera par une première séance dite de « découverte
            ». Il s’agit d’une séance de rencontre de 30 à 45 minutes qui est
            le point de départ de tout travail en coaching. Elle a notamment
            pour but de faire connaissance, d’évaluer la problématique du
            coaché et de s’assurer qu’elle est du domaine de compétence du
            coaching. A ce stade, le coach pourra orienter le coaché vers
            d’autres professionnels si nécessaire.
          </p>
        </div>
        <div>
          <h2 className={styles.modalite__article__h2}>Séances suivantes :</h2>
          <p className={styles.modalite__article__div}>
            Ensuite, le véritable travail de coaching commence. Les séances de
            coaching dureront 1h et seront espacées de 2 semaines.
            <br />
            Elles permettront de prendre conscience du fonctionnement actuel
            et des blocages.
            <br />
            Nous fixerons ensemble un <strong>objectif</strong> (c’est-à-dire
            ce sur quoi vous souhaitez avancer) qui soit clairement mesurable,
            contextualisé et ne dépendant que de vous.
            <br />
          </p>
        </div>
        <div className={`${styles.modalite__article__div} ${styles.modalite__article__div__margin}`}>
          <div>
            <p>
              En fonction de votre demande, des axes de travail vont
              apparaître. Nous établirons un plan d’actions concrètes pour
              activer le changement. Nous fixerons ensemble le rythme et le
              cadre des séances.
              <br />
              Tout au long des rencontres, nous échangerons sur votre
              accompagnement et sur le processus en cours. Au fur et à mesure,
              nous explorerons de nouvelles pistes et de nouvelles méthodes
              pour aborder les difficultés rencontrées. A ce titre, le suivi
              comportera une séance « bilan intermédiaire ». Le coaching vous
              permettra de prendre conscience de votre potentiel et de vous
              aider à atteindre votre objectif. Vous identifierez vos blocages
              et vos résistances, il vous aidera à les dépasser. Souvent, le
              processus complet d’un coaching classNameique se déroule sur un
              nombre de séances définies préalablement, environ 10-12 séances.
              Pour des problématiques simples, quelques séances peuvent
              suffire, environ 5 à 6 séances. Le coaching se terminera
              toujours par une séance de « clôture » permettant de valider
              l’atteinte de l’objectif. Organisation des rendez-vous selon les
              besoins :
            </p>
            <ul className={styles.modalite__article__div__ul}>
              <li>RDV dans un lieu neutre (café, parc …) ;</li>
              <li>
                RDV à votre domicile (coaching familial parents / enfants) ;
              </li>
              <li>RDV en visio .</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
  )
}

export default Modalite