import styles from "./LastnameData.module.scss";
import Image from "@/app/components/image/Image";

const LastnameDataError = () => {
    return (
        <>
            <button
                tabIndex={0}
                disabled={true}
                className={`${styles.card__load} modalOpen`}
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
                        <strong>Nom de famille</strong>
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
export default LastnameDataError