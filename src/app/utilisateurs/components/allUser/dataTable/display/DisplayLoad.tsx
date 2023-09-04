import React from "react";
import styles from "./Display.module.scss";

const DisplayLoad = () => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.table__head}>
          <tr className={styles.table__head__tr}>
            <th className={`${styles.table__head__tr__th}`}>id</th>
            <th className={`${styles.table__head__tr__th}`}>Prénom</th>
            <th className={`${styles.table__head__tr__th}`}>Nom</th>
            <th className={`${styles.table__head__tr__th}`}>Mail</th>
            <th className={`${styles.table__head__tr__th}`}>Téléphone</th>
            <th className={`${styles.table__head__tr__th}`}>RendezVous</th>
            <th className={`${styles.table__head__tr__th}`}>Status</th>
          </tr>
        </thead>
        <tbody className={styles.table__body}>
          <tr key={1}>
            <td
              colSpan={7}
              className={`${styles.table__body__tr__td__odd__first} ${styles.table__body__tr__td__odd__first__center}`}
            >
              En attente de chargement des données
              <div className={styles.arc}>
                <div className={styles.arc__circle}></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DisplayLoad;
