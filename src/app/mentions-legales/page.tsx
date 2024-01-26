import React from "react";
import styles from "./page.module.scss";

const page = () => {
  return (
    <>
      <main className={styles.ml}>
        <h1 className={styles.ml__h1}>Mentions légales</h1>
        <p className={styles.ml__p}>En vigueur au 22/01/2024</p>
        <h2 className={styles.ml__h2}>Présentation du site</h2>
        <p className={styles.ml__p}>
          En vertu de l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004
          pour la confiance dans l&apos;économie numérique, il est précisé aux
          utilisateurs du site tdscoaching.fr l&apos;identité des différents
          intervenants dans le cadre de sa réalisation et de son suivi :
        </p>
        <p className={styles.ml__p}>
          <strong>Propriétaire</strong> : Thierry DA SILVA SEABRA - tds direct
          services
        </p>
        <p className={styles.ml__p}>
          <strong>Créateur</strong> : Thierry DA SILVA SEABRA - tds direct
          services
        </p>
        <p className={styles.ml__p}>
          <strong>Responsable publication</strong> : Thierry DA SILVA SEABRA -
          tds direct services
        </p>
        <p className={styles.ml__p}>
          Le responsable publication est une personne physique ou une personne
          morale.
        </p>
        <p className={styles.ml__p}>
          <strong>Webmaster</strong> : Thomas DA SILVA SEABRA -
          thomas.dss@protonmail.com
        </p>
        <p className={styles.ml__p}>
          <strong>Hébergeur</strong> : Vercel Inc – 440 N Barranca Ave #4133 –
          Covina, CA 91723
        </p>
      </main>
    </>
  );
};

export default page;
