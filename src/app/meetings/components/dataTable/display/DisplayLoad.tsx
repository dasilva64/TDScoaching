import React from "react";
import styles from "./Display.module.scss";

const DisplayLoad = () => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.table__head}>
          <tr className={styles.table__head__tr}>
            <th className={`${styles.table__head__tr__th}`}>id</th>
            <th className={`${styles.table__head__tr__th}`}>startAt</th>
            <th className={`${styles.table__head__tr__th}`}>endAt</th>
            <th className={`${styles.table__head__tr__th}`}>status</th>
            <th className={`${styles.table__head__tr__th}`}>userId</th>
            <th className={`${styles.table__head__tr__th}`}>prenom</th>
            <th className={`${styles.table__head__tr__th}`}>nom</th>
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
