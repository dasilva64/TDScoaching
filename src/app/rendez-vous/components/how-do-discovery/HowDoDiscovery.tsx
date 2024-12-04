import React from "react";
import styles from "./HowDoDiscovery.module.scss";

const HowDoDiscovery = () => {
  return (
    <>
      <div className={styles.HowDoDiscovery}>
        <h2 className={styles.HowDoDiscovery__h2}>Comment faire ?</h2>
        <div className={styles.HowDoDiscovery__container}>
          <div className={styles.HowDoDiscovery__container__card}>
            <div className={styles.HowDoDiscovery__container__card__div}>
              <p className={styles.HowDoDiscovery__container__card__div__p}>
                <strong>1</strong>
              </p>
            </div>
            <p className={styles.HowDoDiscovery__container__card__p}>
              Cliquer sur le bouton &quot;Prendre rendez-vous&quot; ci-dessous
              pour afficher le calendrier
            </p>
          </div>
          <div className={styles.HowDoDiscovery__container__card}>
            <div className={styles.HowDoDiscovery__container__card__div}>
              <p className={styles.HowDoDiscovery__container__card__div__p}>
                <strong>2</strong>
              </p>
            </div>
            <p className={styles.HowDoDiscovery__container__card__p}>
              Sélectionnez la date souhaitée dans le calendrier
            </p>
          </div>
          <div className={styles.HowDoDiscovery__container__card}>
            <div className={styles.HowDoDiscovery__container__card__div}>
              <p className={styles.HowDoDiscovery__container__card__div__p}>
                <strong>3</strong>
              </p>
            </div>
            <p className={styles.HowDoDiscovery__container__card__p}>
              Sélectionnez le type de coaching que vous souhaitez prendre
            </p>
          </div>
          <div className={styles.HowDoDiscovery__container__card}>
            <div className={styles.HowDoDiscovery__container__card__div}>
              <p className={styles.HowDoDiscovery__container__card__div__p}>
                <strong>4</strong>
              </p>
            </div>
            <p className={styles.HowDoDiscovery__container__card__p}>
              Vous recevrez un mail de confirmation et le lien de la
              visioconférence 48h avant le rendez-vous
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowDoDiscovery;
