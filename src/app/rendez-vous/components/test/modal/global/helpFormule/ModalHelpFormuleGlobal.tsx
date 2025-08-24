import TabIndex from "@/app/components/tabIndex/TabIndex"
import { RootState } from "@/app/redux/store/store"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import Image from "@/app/components/image/Image"
import styles from "./ModalHelpFormuleGlobal.module.scss"
import { useSelector, useDispatch } from "react-redux"

const ModalHelpFormuleGlobal = () => {
  const { displayModalContractHelpRendezVous } = useSelector((state: RootState) => state.ModalContractHelpRendezVous)
  const dispatch = useDispatch()
  const closeModal = () => {
    setRadioInput("")
    setRadioInputError("")
    dispatch({
      type: "ModalContractHelpRendezVous/close"
    })
  }
  const [radioInput, setRadioInput] = useState("")
  const [radioInputError, setRadioInputError] = useState("")
  return (
    <>
      <TabIndex displayModal={displayModalContractHelpRendezVous} />
      <AnimatePresence>
        {displayModalContractHelpRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalHelpContract}
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
                className={styles.modalHelpContract__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalHelpContract__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalHelpContract__h1}`}>Offre - Comment ça marche ?</h2>
              <div className={styles.modalHelpContract__container}>

                <div className={styles.modalHelpContract__card}>
                  <p className={styles.modalHelpContract__card__title}>Étape 1 - Choix de l&apos;offre</p>
                  <div className={styles.modalHelpContract__card__radio}>
                    <div className={styles.modalHelpContract__card__radio__element}>
                      <label htmlFor="">Unique</label>
                      <input onChange={(e) => {
                        setRadioInput(e.target.value)
                        setRadioInputError("")
                      }} type="radio" name="offre" id="" value={"unique"} />
                    </div>
                    <div className={styles.modalHelpContract__card__radio__element}>
                      <label htmlFor="">Flash ou sur mesure</label>
                      <input onChange={(e) => {
                        setRadioInput(e.target.value)
                        setRadioInputError("")
                      }} type="radio" name="offre" id="" value={"autre"} />
                    </div>

                  </div>
                  <p className={styles.modalHelpContract__card__error}>{radioInputError}</p>
                </div>

                {radioInput === "unique" && (
                  <>
                    <Image
                      className={styles.modalHelpContract__card__row}
                      src="/assets/icone/arrow-down-solid.svg"
                      alt="icone fermer modal"
                      width={20}
                      height={20}
                    ></Image>
                    <div className={styles.modalHelpContract__card}>
                      <p className={styles.modalHelpContract__card__title}>Étape 2 - Calendrier</p>
                      <p>- Choix de la date et heure du rendez-vous sur le calendrier</p>
                    </div>
                    <Image
                      className={styles.modalHelpContract__card__row}
                      src="/assets/icone/arrow-down-solid.svg"
                      alt="icone fermer modal"
                      width={20}
                      height={20}
                    ></Image>
                    <div className={styles.modalHelpContract__card}>
                      <p className={styles.modalHelpContract__card__title}>Étape 3 - Modal récapitulatif</p>
                      <p>- Affichage récapitulatif de l&apos;offre et du rendez-vous selectionné</p>
                      <p>- Choix du type de coaching</p>
                    </div>
                    <Image
                      className={styles.modalHelpContract__card__row}
                      src="/assets/icone/arrow-down-solid.svg"
                      alt="icone fermer modal"
                      width={20}
                      height={20}
                    ></Image>
                    <div className={styles.modalHelpContract__card}>
                      <p className={styles.modalHelpContract__card__title}>Étape 4 - Enregistrement de la carte</p>
                      <p>- Votre carte est enregistrée de manière sécurisée via Stripe.</p>
                      <p>- Le paiement sera effectué uniquement à la fin du rendez-vous.</p>
                      
                    </div>

                  </>
                )}
                {radioInput === "autre" && (
                  <>
                    <Image
                      className={styles.modalHelpContract__card__row}
                      src="/assets/icone/arrow-down-solid.svg"
                      alt="icone fermer modal"
                      width={20}
                      height={20}
                    ></Image>
                    <div className={styles.modalHelpContract__card}><p className={styles.modalHelpContract__card__title}>Étape 2 - Modal récapitulatif</p>
                      <p>- Affichage récapitulatif de l&apos;offre selectionné</p>
                      <p>- Choix du type de coaching</p></div>
                    <Image
                      className={styles.modalHelpContract__card__row}
                      src="/assets/icone/arrow-down-solid.svg"
                      alt="icone fermer modal"
                      width={20}
                      height={20}
                    ></Image>
                     <div className={styles.modalHelpContract__card}>
                      <p className={styles.modalHelpContract__card__title}>Étape 4 - Enregistrement de la carte</p>
                      <p>- Votre carte est enregistrée de manière sécurisée via Stripe.</p>
                      <p>- Le paiement sera effectué uniquement à la fin de chaque rendez-vous.</p>
                      
                    </div>

                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalHelpFormuleGlobal