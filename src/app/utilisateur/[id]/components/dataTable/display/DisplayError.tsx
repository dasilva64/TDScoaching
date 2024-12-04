import React from "react";
import styles from "./Display.module.scss";

const DisplayError = () => {
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
              Erreur de chargement
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DisplayError;
