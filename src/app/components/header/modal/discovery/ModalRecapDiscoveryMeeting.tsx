import TabIndex from "@/app/components/tabIndex/TabIndex";
import React from "react";
import styles from "./ModalRecapDiscoveryMeeting.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/app/redux/store";

const ModalRecapDiscoveryMeeting = () => {
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: "ModalRecapDiscoveryMeeting/close",
    });
  };
  const {
    displayModalRecapDiscoveryMeeting,
    emailModalRecapDiscoveryMeeting,
    dateModalRecapDiscoveryMeeting,
  } = useSelector((state: RootState) => state.ModalRecapDiscoveryMeeting);
  return (
    <>
      <TabIndex displayModal={displayModalRecapDiscoveryMeeting} />
      <AnimatePresence>
        {displayModalRecapDiscoveryMeeting === true && (
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
              <p className={styles.modal__email}>
                {emailModalRecapDiscoveryMeeting}
              </p>
              <div className={styles.modal__rappel}>
                <p className={styles.modal__rappel__p}>
                  <Image
                    className={styles.modal__rappel__p__img}
                    src="/assets/icone/calendar-regular.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {new Date(dateModalRecapDiscoveryMeeting).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className={styles.modal__rappel__p}>
                  <Image
                    className={styles.modal__rappel__p__img}
                    src="/assets/icone/clock-solid.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {new Date(dateModalRecapDiscoveryMeeting).toLocaleTimeString(
                    "fr-FR"
                  )}
                </p>
              </div>
              <p>
                Veuillez confirmer votre rendez-vous 24h avant la date du
                rendez-vous, sinon celui ci sera supprimé automatiquement.
              </p>
              <div className={styles.modal__submit}>
                <button className={styles.modal__submit__btn}>
                  Comfirmer votre rendez-vous
                </button>
              </div>
              <p>
                Un mail vous a été envoyé avec les informations du rendez-vous
                et la posibilité de le modifier ou le supprimer et également de
                confirmation.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalRecapDiscoveryMeeting;
