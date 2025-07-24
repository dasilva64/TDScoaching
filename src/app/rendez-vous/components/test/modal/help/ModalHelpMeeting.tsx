import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ModalHelpMeeting.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
import Image from "@/app/components/image/Image";

const ModalHelpMeeting = ({ offre }: any) => {
  const { displayModalHelpRendezVous } = useSelector((state: RootState) => state.ModalHelpRendezVous)
  const dispatch = useDispatch()
  const closeModal = () => {
    dispatch({
      type: "ModalHelpRendezVous/close"
    })
  }
  return (
    <>
      <TabIndex displayModal={displayModalHelpRendezVous} />
      <AnimatePresence>
        {displayModalHelpRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalHelpMeeting}
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
                className={styles.modalHelpMeeting__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalHelpMeeting__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalHelpMeeting__h1}`}>Rendez-vous {offre.type === "discovery" ? "de découverte" : ""} - Comment ça marche ?</h2>
              <div className={styles.modalHelpMeeting__container}>

                <div className={styles.modalHelpMeeting__card}>
                  <p className={styles.modalHelpMeeting__card__title}>Étape 1 - Calendrier</p>
                  <p>- Choix de la date et heure du rendez-vous sur le calendrier</p>
                </div>
                <Image
                  className={styles.modalHelpMeeting__card__row}
                  src="/assets/icone/arrow-down-solid.svg"
                  alt="icone fermer modal"
                  width={20}
                  height={20}
                ></Image>
                <div className={styles.modalHelpMeeting__card}>
                  <p className={styles.modalHelpMeeting__card__title}>Étape 2 - Modal recapitulatif</p>
                  <p>- Affichage récapitulatif du rendez-vous selectionné</p>
                  <ul className={styles.modalHelpMeeting__card__list}>
                    <li>Type</li>
                    <li>Date</li>
                    <li>Heure</li>
                    <li>Durée</li>
                    <li>Prix</li>
                    <li>Nombre de rendez-vous restant</li>
                  </ul>
                  <p>- Et Choix du type de rendez-vous</p>
                </div>
                {offre.type !== "discovery" && (
                  <>
                    <Image
                      className={styles.modalHelpMeeting__card__row}
                      src="/assets/icone/arrow-down-solid.svg"
                      alt="icone fermer modal"
                      width={20}
                      height={20}
                    ></Image>
                    <div className={styles.modalHelpMeeting__card}>
                      <p className={styles.modalHelpMeeting__card__title}>Étape 3 - Paiement sécurisé</p>
                      <p>Pour finaliser votre rendez-vous payant, vous allez être redirigé vers notre interface de paiement sécurisée via Stripe.</p>
                      <ul className={styles.modalHelpMeeting__card__list}>
                        <li><span className={styles.modalHelpMeeting__card__list__strong}>Sécurité garantie</span> : Stripe est une plateforme de paiement mondialement reconnue, utilisée par des millions d&apos;entreprises. Toutes les transactions sont protégées par un système de chiffrement de niveau bancaire.</li>
                        <li><span className={styles.modalHelpMeeting__card__list__strong}>Processus simple et rapide</span> : Le paiement s’effectue en quelques clics. Vous n’avez besoin que de vos informations bancaires habituelles.</li>
                        <li><span className={styles.modalHelpMeeting__card__list__strong}>Aucune information stockée</span> : Nous ne conservons aucune donnée bancaire. Toutes les informations sont traitées exclusivement par Stripe, en toute confidentialité.</li>
                        <li><span className={styles.modalHelpMeeting__card__list__strong}>Confirmation instantanée</span> : Une fois le paiement validé, vous recevrez une confirmation de votre rendez-vous par email.</li>
                      </ul>

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

export default ModalHelpMeeting