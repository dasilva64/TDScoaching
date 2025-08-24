import Image from "@/app/components/image/Image";
import styles from "./FormuleNotConfirm.module.scss"
import { useDispatch, useSelector } from "react-redux";
import fetchPost from "@/app/components/fetch/FetchPost";
import { mutate as globalMutate } from "swr"
import { useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/redux/store/store";

const FormuleNotConfirm = ({ offre }: any) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const {csrfToken} = useSelector((state: RootState) => state.csrfToken)
    const { data: dataSee, trigger: triggerSee, reset: resetSee, isMutating: isMutatingSee } = useSWRMutation("/rendez-vous/components/test/api/take/see", fetchPost)
    useEffect(() => {
        if (dataSee) {
            if (dataSee.status === 200) {
                resetSee();
                window.open(dataSee.body, '_ blank')
            } else if (dataSee.status === 401) {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: {
                        type: "error",
                        flashMessage: dataSee.message,
                    },
                });
                resetSee();
                globalMutate("/components/header/api");
                globalMutate("/components/header/ui/api");
                router.push(`/acces-refuse?destination=rendez-vous`)
            } else {
                resetSee();
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: {
                        type: "error",
                        flashMessage: dataSee.message,
                    },
                });
            }
        }
    }, [dataSee, dispatch, resetSee, router])
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
                        <div className={styles.formule__card__action}>
                            {!isMutatingSee && (
                                <button
                                    className={styles.formule__card__action__btn}
                                    onClick={() => {
                                        const fetchContract = async () => {
                                            triggerSee({
                                                csrfToken: csrfToken
                                            })
                                        }
                                        fetchContract()
                                    }}
                                >
                                    Consulter le contrat de prestation
                                </button>
                            )}
                            {isMutatingSee && (
                                <button
                                    disabled
                                    className={
                                        styles.formule__card__action__btn__load
                                    }
                                >
                                    <span
                                        className={
                                            styles.formule__card__action__btn__load__span
                                        }
                                    >
                                        Chargement
                                    </span>

                                    <div
                                        className={
                                            styles.formule__card__action__btn__load__arc
                                        }
                                    >
                                        <div
                                            className={
                                                styles.formule__card__action__btn__load__arc__circle
                                            }
                                        ></div>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <p> Souhaitez-vous confirmer votre offre
                    ?</p>
                <div className={styles.actions}>
                    <button className={styles.actions__reprendre} onClick={async () => {
                        /*  if (offre.contract_status === "GENERATED_NAME_ONLY") {
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
                             }); */
                        dispatch({
                            type: "ModalConfirmPaidMeetingRendezVous/open",
                        });
                    }}>Oui, confirmer</button>
                    <button className={styles.actions__annule} onClick={() => {
                        dispatch({
                            type: "ModalFormuleEditRendezVous/open",
                            payload: { id: offre.id },
                        });
                    }}>Non, changer d&apos;offre</button>
                </div>
                {/*  <p onClick={() => {
                    dispatch({
                      type: "ModalHelpPaiementRendezVous/open"
                    })

                  }} className={styles.actions__help}>Information sur le paiement</p> */}
            </div>

        </>
    )
}

export default FormuleNotConfirm