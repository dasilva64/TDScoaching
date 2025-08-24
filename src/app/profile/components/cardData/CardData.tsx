import { AppDispatch, RootState } from "@/app/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "@/app/components/image/Image";
import styles from "./CardData.module.scss"
import fetchPost from "@/app/components/fetch/FetchPost";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useSWRMutation from "swr/dist/mutation";

const CardData = ({ data: userData }: any) => {
    const dispatch = useDispatch();
    /* const { trigger, data, reset, isMutating } = useSWRMutation(
        "/profile/components/twoFAData/api",
        fetchPost
    ); */
    const [checked, setChecked] = useState(userData.body.saveCard)
    const router = useRouter()
    const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
    /* useEffect(() => {
        if (data) {
            if (data.status === 200) {
                if (data.twoFaCheck === false) {
                    dispatch({
                        type: "ModalTwoFADesactivation/open"
                    })
                } else {
                    dispatch({
                        type: "ModalTwoFAActivation/open"
                    })
                }
                reset();
            } else if (data.status === 401) {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "error", flashMessage: data.message },
                });
                reset();
                globalMutate("/components/header/api");
                globalMutate("/components/header/ui/api");
                router.push(`/acces-refuse?destination=profile`);
            } else {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "error", flashMessage: data.message },
                });
                reset();
            }
        }
    }, [
        data,
        dispatch,
        isMutating,
        reset,
        router,
        userData,
    ]); */
    const handleChange = (e: any) => {
        if (e.target.checked !== false || e.target.checked !== true) {
            if (e.target.checked === true) {
                dispatch({
                    type: "ModalSaveCardActivation/open",
                });
            } else {
                dispatch({
                    type: "ModalSaveCardDesactivation/open",
                });
            }
            //trigger({ twoFaCheck: e.target.checked, csrfToken: csrfToken })

        }

    }
    return (
        <>
            <button
                className={`${styles.card} modalOpen`}
                tabIndex={0}
            >
                <Image
                    className={styles.card__icone}
                    width="20"
                    height="20"
                    priority={true}
                    src={"/assets/icone/paiement-securise.png"}
                    alt="bousole"
                />
                <div className={styles.card__info}>
                    <p className={styles.card__info__name}>
                        <strong>Sauvegarder ma carte</strong>
                    </p>
                    <div className={styles.card__info__switch}>
                        <p>Désactivé</p>
                        <label className={styles.card__info__switch__input}>
                            <input type="checkbox" checked={userData.body.saveCard} onChange={handleChange} />
                            <span></span>
                        </label>
                        <p>Activé</p>
                    </div>
                    <p className={styles.card__info__description}>
                        En activant cette option, votre carte sera sauvegardée de manière sécurisée pour faciliter vos futurs paiements.
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

export default CardData