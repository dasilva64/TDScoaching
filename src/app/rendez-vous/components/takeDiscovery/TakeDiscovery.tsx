/* import React from "react";
import styles from "./TakeDiscovery.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TakeDiscovery = () => {
  const { push } = useRouter();
  return (
    <>
      <div className={styles.TakeDiscovery}>
        <h2 className={styles.TakeDiscovery__h2}>
          Aucun rendez-vous programmé
        </h2>
        <div className={styles.TakeDiscovery__container}>
          <div className={styles.TakeDiscovery__container__offre}>
            <div className={styles.TakeDiscovery__container__offre__content}>
              <h3
                className={styles.TakeDiscovery__container__offre__content__h3}
              >
                Rendez-vous découverte
              </h3>
              <p className={styles.TakeDiscovery__container__offre__content__p}>
                Ce rendez-vous est gratuit et sans engagement. Il permet de
                faire connaissance et de définir ensemble vos objectifs et vos
                besoins. Vous pouvez sélectionner une date en cliquant sur le
                bouton ci-dessus.
              </p>
              <div
                className={styles.TakeDiscovery__container__offre__content__div}
              >
                <Image
                  className={
                    styles.TakeDiscovery__container__offre__content__div__img
                  }
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/clock-solid.svg"}
                  alt="bousole"
                />
                <p
                  className={
                    styles.TakeDiscovery__container__offre__content__div__p
                  }
                >
                  : 30 min
                </p>
              </div>
              <div
                className={styles.TakeDiscovery__container__offre__content__div}
              >
                <Image
                  className={
                    styles.TakeDiscovery__container__offre__content__div__img
                  }
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/euro-sign-solid.svg"}
                  alt="bousole"
                />
                <p
                  className={
                    styles.TakeDiscovery__container__offre__content__div__p
                  }
                >
                  : Gratuit
                </p>
              </div>
            </div>
          </div>

          <div className={styles.TakeDiscovery__container__info}>
            <p className={styles.TakeDiscovery__container__info__p}>
              Vous pouvez m&apos;envoyer un mail en cliquant sur le bouton
              ce-dessous si vous voulez avoir d&apos;avantage de renseignement
              ou pour prendre un rendez-vous personnalisé.
            </p>
            <div className={styles.TakeDiscovery__container__info__content}>
              <button
                className={styles.TakeDiscovery__container__info__content__btn}
                onClick={() => {
                  push("/contact");
                }}
              >
                Me contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TakeDiscovery;
 */