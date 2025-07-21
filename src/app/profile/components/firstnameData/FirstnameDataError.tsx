import Image from "@/app/components/image/Image";
import styles from "./FirstnameData.module.scss"

const FirstnameDataError = () => {
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
          src={"/assets/icone/user-solid.svg"}
          alt="bousole"
        />
        <div className={styles.card__info}>
          <p className={styles.card__info__name}>
            <strong>Prénom</strong>
          </p>
          <p data-text={"Erreur de chargement des données, veuillez réessayer"} className={styles.card__info__p}>
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

export default FirstnameDataError