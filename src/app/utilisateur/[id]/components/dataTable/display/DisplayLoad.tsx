import React from "react";
import styles from "./Display.module.scss";

const DisplayLoad = () => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.table__head}>
          <tr className={styles.table__head__tr}>
            <th
              className={`${styles.table__head__tr__th} ${styles.table__head__tr__th__asc__little}`}
            >
              Début
            </th>
            <th
              className={`${styles.table__head__tr__th} ${styles.table__head__tr__th__asc__little}`}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className={styles.table__body}>
          <tr key={1}>
            <td
              colSpan={2}
              className={`${styles.table__body__tr__td__odd__first} ${styles.table__body__tr__td__odd__first__center}`}
            >
              En attende de chargement
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
