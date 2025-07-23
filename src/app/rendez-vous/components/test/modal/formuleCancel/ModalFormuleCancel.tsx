import TabIndex from "@/app/components/tabIndex/TabIndex"
import { RootState } from "@/app/redux/store/store"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import Image from "@/app/components/image/Image"
import styles from "./ModalFormuleCancel.module.scss"
import { useSelector, useDispatch } from "react-redux"

const ModalFormuleCancel = () => {
    const { displayModalFormuleCancelRendezVous } = useSelector((state: RootState) => state.ModalFormuleCancelRendezVous)
    const dispatch = useDispatch()
    const closeModal = () => {
        dispatch({
            type: "ModalFormuleCancelRendezVous/close"
        })
    }
    return (
        <>
            <TabIndex displayModal={displayModalFormuleCancelRendezVous} />
            <AnimatePresence>
                {displayModalFormuleCancelRendezVous === true && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ opacity: 0 }}
                            className={styles.bg}
                            onClick={() => closeModal()}
                        />
                        <motion.div
                            className={styles.modalFormuleCancel}
                            initial={{ y: 200, x: "-50%", opacity: 0 }}
                            animate={{
                                y: "-50%",
                                x: "-50%",
                                opacity: 1,
                                transition: { duration: 0.3 },
                            }}
                            exit={{
                                y: 200,
                                x: "-50%",
                                opacity: 0,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <button
                                type="button"
                                className={styles.modalFormuleCancel__btn}
                                onClick={() => closeModal()}
                            >
                                <Image
                                    className={styles.modalFormuleCancel__btn__img}
                                    src="/assets/icone/xmark-solid.svg"
                                    alt="icone fermer modal"
                                    width={30}
                                    height={30}
                                ></Image>
                            </button>
                            <h2 className={`${styles.modalFormuleCancel__h1}`}>Annuler l&apos;offre</h2>
                            <p>En supprimant votre offre, vous serez rembourser de la difference de l&apos;argent par rapport au rdv</p>
                            <p>Vous ne bénéficirait donc plus des avantages de votre offre comme les bilan offert ou les bilans entre les rdv</p>
                            <p>Êtes vous sûre de vouloir supprimer votre offre ?</p>
                            <div>
                                <button>Oui, annuler</button>
                                <button onClick={() => {
                                    dispatch({
                                        type: "ModalFormuleCancelRendezVous/close"
                                    })
                                }}>Non, quitter</button>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default ModalFormuleCancel