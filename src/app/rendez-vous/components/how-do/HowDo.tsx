import React from "react";
import styles from "./HowDo.module.scss";

const HowDo = () => {
  return (
    <>
      <div className={styles.HowDo}>
        <h2 className={styles.HowDo__h2}>Comment faire ?</h2>
        <div className={styles.HowDo__container}>
          <div className={styles.HowDo__container__card}>
            <div className={styles.HowDo__container__card__div}>
              <p className={styles.HowDo__container__card__div__p}>
                <strong>1</strong>
              </p>
            </div>
            <p className={styles.HowDo__container__card__p}>
              Cliquer sur le bouton &quot;Prendre rendez-vous&quot; ci-dessous
              pour afficher le calendrier
            </p>
          </div>
          <div className={styles.HowDo__container__card}>
            <div className={styles.HowDo__container__card__div}>
              <p className={styles.HowDo__container__card__div__p}>
                <strong>2</strong>
              </p>
            </div>
            <p className={styles.HowDo__container__card__p}>
              Sélectionnez la date souhaitée dans le calendrier
            </p>
          </div>
          <div className={styles.HowDo__container__card}>
            <div className={styles.HowDo__container__card__div}>
              <p className={styles.HowDo__container__card__div__p}>
                <strong>3</strong>
              </p>
            </div>
            <p className={styles.HowDo__container__card__p}>
              Sélectionnez le type de coaching que vous souhaitez prendre
            </p>
          </div>
          <div className={styles.HowDo__container__card}>
            <div className={styles.HowDo__container__card__div}>
              <p className={styles.HowDo__container__card__div__p}>
                <strong>4</strong>
              </p>
            </div>
            <p className={styles.HowDo__container__card__p}>
              Payez en ligne pour confirmer votre rendez-vous (paiement
              sécurisé)
            </p>
          </div>
          <div className={styles.HowDo__container__card}>
            <div className={styles.HowDo__container__card__div}>
              <p className={styles.HowDo__container__card__div__p}>
                <strong>5</strong>
              </p>
            </div>
            <p className={styles.HowDo__container__card__p}>
              Vous recevrez un mail de confirmation et le lien de la
              visioconférence 48h avant le rendez-vous
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowDo;
