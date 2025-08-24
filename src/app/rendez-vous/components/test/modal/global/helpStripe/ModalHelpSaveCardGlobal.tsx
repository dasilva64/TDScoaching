import TabIndex from "@/app/components/tabIndex/TabIndex"
import { RootState } from "@/app/redux/store/store"
import { AnimatePresence, motion } from "framer-motion"
import styles from "./ModalHelpSaveCardGlobal.module.scss"
import Image from "@/app/components/image/Image"
import { useSelector, useDispatch } from "react-redux"

const ModalHelpSaveCardGlobal = () => {
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
                <p className={styles.modalHelpPaiement__card__title}>🛡️ Enregistrement sécurisé via Stripe</p>
                <p>
                  Lors de votre réservation, votre carte est enregistrée via Stripe, notre partenaire de paiement sécurisé.
                  Cette étape garantit une transaction fluide et conforme aux standards PCI-DSS.
                  <br />
                  Aucun montant n’est débité à ce stade.
                </p>
              </div>
              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>🔐 Création de votre compte de paiement</p>
                <p>
                  Lorsque vous cliquez sur “Passer au paiement”, nous créons (ou retrouvons) votre profil client sur Stripe et générons un SetupIntent.
                  Cette étape nous permet d’enregistrer votre carte en toute sécurité sans débit immédiat.
                </p>
              </div>
              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>💳 Paiement en fin de rendez-vous</p>
                <p>
                  Le montant du rendez-vous est débité <strong>uniquement après la prestation</strong>, une fois le rendez-vous terminé et validé.
                  Vous n’avez rien à faire : le paiement est automatique via la carte enregistrée.
                </p>
              </div>

              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>🗑️ Annulation sans frais</p>
                <p>
                  Si vous annulez votre rendez-vous <strong>avant son début</strong>, aucun montant ne sera prélevé.
                  La carte enregistrée sera automatiquement désactivée pour cette session.
                </p>
              </div>

              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>📩 Confirmation par e-mail</p>
                <p>
                  Après votre réservation, vous recevrez un e-mail contenant tous les détails du rendez-vous.
                  Une confirmation de paiement vous sera envoyée une fois le rendez-vous terminé.
                </p>
              </div>

              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>📆 Modification possible</p>
                <p>
                  Vous pouvez modifier ou reprogrammer votre rendez-vous depuis votre espace personnel, sous réserve de disponibilité.
                  La carte enregistrée reste valide pour la nouvelle date.
                </p>
              </div>

              <div className={styles.modalHelpPaiement__card}>
                <p className={styles.modalHelpPaiement__card__title}>🔎 Besoin d’aide ?</p>
                <p>
                  Notre équipe est disponible pour toute question liée à l’enregistrement de votre carte ou au paiement.
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalHelpSaveCardGlobal