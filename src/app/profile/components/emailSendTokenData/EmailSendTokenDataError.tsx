import React from "react";
import styles from "./EmailSendTokenData.module.scss";
import Image from "@/app/components/image/Image";

const EmailSendTokenDataError = () => {
return (
    <>
      <button
        className={`${styles.card__load} modalOpen`}
        tabIndex={0}
        disabled={true}
      >
        <Image
          className={styles.card__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/envelope-at-fill.svg"}
          alt="bousole"
        />
        <div className={styles.card__info}>
          <p className={styles.card__info__name}>
            <strong>Adresse email</strong>
          </p>
          <p className={styles.card__info__p} data-text={"Erreur de chargement des données, veuillez réessayer"}>
            {"Erreur de chargement des données, veuillez réessayer"}
          </p>
        </div>
        <Image
          className={styles.card__info__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/chevron-right-solid.svg"}
          alt="bousole"
        />
      </button>
    </>
  );

}

export default EmailSendTokenDataError