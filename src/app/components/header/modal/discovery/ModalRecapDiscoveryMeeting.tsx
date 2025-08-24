import TabIndex from "@/app/components/tabIndex/TabIndex";
import React, { useEffect, useState } from "react";
import styles from "./ModalRecapDiscoveryMeeting.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Image from "@/app/components/image/Image";
import { RootState } from "@/app/redux/store/store";

const ModalRecapDiscoveryMeeting = () => {

  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: "ModalRecapDiscoveryMeetingHeader/close",
    });
  };
  
  const {
    displayModalRecapDiscoveryMeetingHeader,
    emailModalRecapDiscoveryMeetingHeader,
    dateModalRecapDiscoveryMeetingHeader,
    typeModalRecapDiscoveryMeetingHeader,
  } = useSelector((state: RootState) => state.ModalRecapDiscoveryMeetingHeader);
  const [confirmationDeadline, setConfirmationDeadline] = useState<Date | null>(null);
  
    useEffect(() => {
      const deadline = new Date(dateModalRecapDiscoveryMeetingHeader);
      deadline.setHours(deadline.getHours() - 10);
      setConfirmationDeadline(deadline);
    }, [dateModalRecapDiscoveryMeetingHeader]);
  return (
    <>
      <TabIndex displayModal={displayModalRecapDiscoveryMeetingHeader} />
      <AnimatePresence>
        {displayModalRecapDiscoveryMeetingHeader === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modal}
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
                className={styles.modal__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modal__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modal__h1}`}>
                Récapitulatif de votre rendez-vous de découverte
              </h2>
              <div className={styles.modal__rappel}>
                <p className={styles.modal__rappel__p}>
              <strong className={styles.modal__rappel__p__strong}>Email :&nbsp;</strong> {emailModalRecapDiscoveryMeetingHeader}
              </p>
              <p className={styles.modal__rappel__p}>
                  <strong className={styles.modal__rappel__p__strong}>Date :&nbsp;</strong>
                  {new Date(
                    dateModalRecapDiscoveryMeetingHeader
                  ).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={styles.modal__rappel__p}>
                  <strong className={styles.modal__rappel__p__strong}>Heure :&nbsp;</strong>
                  {new Date(
                    dateModalRecapDiscoveryMeetingHeader
                  ).toLocaleTimeString("fr-FR")}
                </p>
                <p className={styles.modal__rappel__p}>
                  <strong className={styles.modal__rappel__p__strong}>Type de coaching :&nbsp;</strong> 
                  {typeModalRecapDiscoveryMeetingHeader}
                </p>
              </div>
              <p className={styles.modal__info}>
                      <strong className={styles.modal__info__strong}>Attention</strong> : Vous avez jusqu’au {new Date(confirmationDeadline!).toLocaleString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })} pour confirmer votre rendez-vous. Passé ce délai, le rendez-vous expirera automatiquement.
                    </p>
              <p>
                Un mail vous a été envoyé avec les informations du rendez-vous
                et la posibilité de le confirmer / modifier / supprimer.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalRecapDiscoveryMeeting;
