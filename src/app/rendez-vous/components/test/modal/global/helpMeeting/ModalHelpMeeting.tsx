import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ModalHelpMeeting.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
import Image from "@/app/components/image/Image";

const ModalHelpMeeting = () => {
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
              <h2 className={`${styles.modalHelpMeeting__h1}`}>Rendez-vous - Comment ça marche ?</h2>
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
                  <p className={styles.modalHelpMeeting__card__title}>Étape 2 - Modal récapitulatif</p>
                  <p>- Affichage récapitulatif du rendez-vous selectionné</p>
                  <ul className={styles.modalHelpMeeting__card__list}>
                    <li>Type</li>
                    <li>Date</li>
                    <li>Heure</li>
                    <li>Durée</li>
                    <li>Prix</li>
                    <li>Nombre de rendez-vous restant</li>
                  </ul>
                  <p>- Et Choix du type de coaching</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalHelpMeeting