import TabIndex from "@/app/components/tabIndex/TabIndex"
import { RootState } from "@/app/redux/store"
import { AnimatePresence, motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import styles from "./ModalHelpPaiment.module.scss"
import Image from "@/app/components/image/Image"

const ModalHelpPaiement = () => {
  const { displayModalHelpPaiementRendezVous } = useSelector((state: RootState) => state.ModalHelpPaiementRendezVous)
  const dispatch = useDispatch()
  const closeModal = () => {
    dispatch({
      type: "ModalHelpPaiementRendezVous/close"
    })
  }
  return (
    <>
      <TabIndex displayModal={displayModalHelpPaiementRendezVous} />
      <AnimatePresence>
        {displayModalHelpPaiementRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalHelpPaiement}
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
                className={styles.modalHelpPaiement__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalHelpPaiement__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalHelpPaiement__h1}`}>Paiement - Comment ça marche ?</h2>

              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>🛡️ Paiement sécurisé via Stripe  </p>
                <p>Tous les paiements sont traités par Stripe, une plateforme reconnue mondialement pour sa fiabilité et sa sécurité.
                  Votre paiement est protégé par un chiffrement SSL et conforme aux standards PCI-DSS.</p>
              </div>
              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>💳 Paiement différé </p>
                <p>Lorsque vous réservez un rendez-vous, le montant est simplement autorisé mais **non débité**.
                  Le paiement ne sera effectué **qu’à la fin du rendez-vous**, après confirmation.</p>
              </div>
              <div className={styles.modalHelpPaiement__card}>

                <p className={styles.modalHelpPaiement__card__title}>🗑️ Annulation sans frais </p>
                <p>Vous pouvez annuler votre rendez-vous à tout moment **avant le début**.
                  Aucun montant ne sera prélevé et la session de paiement sera automatiquement annulée.</p>
              </div>
              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>📩 Confirmation par e-mail </p>
                <p>Après votre réservation, vous recevrez un e-mail de confirmation contenant tous les détails du rendez-vous.</p>
              </div>
              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>📆 Modification possible  </p>
                <p>Vous pouvez modifier ou reprogrammer votre rendez-vous directement depuis votre espace personnel, sous réserve de disponibilité.</p>
              </div>
              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>🔎 Besoin d’aide ?  </p>
                <p>N’hésitez pas à nous contacter pour toute question liée au paiement ou à votre réservation.</p>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalHelpPaiement