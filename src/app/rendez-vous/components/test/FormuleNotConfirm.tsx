import Image from "@/app/components/image/Image";
import styles from "./FormuleNotConfirm.module.scss"
import { useDispatch } from "react-redux";

const FormuleNotConfirm = ({ offre }: any) => {
    const dispatch = useDispatch()
    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Votre offre en attente</h1>
                <p>Vous étiez en train de choisir une offre.</p>
                <div className={styles.formule}>
                    <div
                        className={`${styles.formule__card} ${styles.formule__card__unique}`}
                    >
                        <h3 className={styles.formule__card__title}>Pack {offre.type}</h3>
                        {offre.type === "flash" && (
                            <>
                                <ul className={styles.formule__card__content}>
                                    <li className={styles.formule__card__content__li}>
                                        <Image
                                            className={styles.formule__card__content__li__icone}
                                            width="25"
                                            height="25"
                                            priority={true}
                                            src={"/assets/icone/check-solid.svg"}
                                            alt="bousole"
                                        />
                                        3 séances de coaching
                                    </li>
                                    <li className={styles.formule__card__content__li}>
                                        <Image
                                            className={styles.formule__card__content__li__icone}
                                            width="25"
                                            height="25"
                                            priority={true}
                                            src={"/assets/icone/check-solid.svg"}
                                            alt="bousole"
                                        />
                                        1 bilan final offert
                                    </li>
                                </ul>
                                <p className={styles.formule__card__price}>
                                    300
                                    <span>€</span>
                                </p>
                            </>
                        )}
                        {offre.type === "custom" && (
                            <>
                                <ul className={styles.formule__card__content}>
                                    <li className={styles.formule__card__content__li}>
                                        <Image
                                            className={styles.formule__card__content__li__icone}
                                            width="25"
                                            height="25"
                                            priority={true}
                                            src={"/assets/icone/check-solid.svg"}
                                            alt="bousole"
                                        />
                                        Nombre de séances de coaching à définir (selon choix du client et
                                        problématique abordée)
                                    </li>
                                    <li className={styles.formule__card__content__li}>
                                        <Image
                                            className={styles.formule__card__content__li__icone}
                                            width="25"
                                            height="25"
                                            priority={true}
                                            src={"/assets/icone/check-solid.svg"}
                                            alt="bousole"
                                        />
                                        Points d’étape offerts (en fonction de la durée totale du
                                        coaching)
                                    </li>
                                    <li className={styles.formule__card__content__li}>
                                        <Image
                                            className={styles.formule__card__content__li__icone}
                                            width="25"
                                            height="25"
                                            priority={true}
                                            src={"/assets/icone/check-solid.svg"}
                                            alt="bousole"
                                        />
                                        1 bilan final offert
                                    </li>
                                </ul>
                                <p className={styles.formule__card__price}>Prix sur demande</p>
                            </>
                        )}

                    </div>
                </div>
                <p> Souhaitez-vous reprendre là où vous en étiez
                    ?</p>
                <div className={styles.actions}>
                    <button className={styles.actions__reprendre} onClick={async () => {
                        if (offre.contract_status === "GENERATED_NAME_ONLY") {
                            dispatch({
                                type: "ModalContractRendezVous/open",
                                payload: {
                                    type: offre.type,
                                    statut: "reprendre"
                                },
                            });
                        } else if (offre.contract_status === "SIGNED")
                            dispatch({
                                type: "ModalContractRecapRendezVous/open",
                                payload: {
                                    type: offre.type,
                                },
                            });
                    }}>Reprendre</button>
                    <button className={styles.actions__annule} onClick={() => {
                        dispatch({
                            type: "ModalFormuleEditRendezVous/open",
                            payload: { id: offre.id },
                        });
                    }}>Changer d'offre</button>
                </div>
            </div>

        </>
    )
}

export default FormuleNotConfirm