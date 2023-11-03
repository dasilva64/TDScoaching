import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styles from "./DiscoveryModal.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useSelect } from "@mui/base";

const DiscoveryModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const closeForm = () => {
    dispatch({
      type: "ModalDiscovery/close",
    });
  };
  const { displayModalDiscovery } = useSelector(
    (state: RootState) => state.ModalDiscovery
  );
  return (
    <>
      <AnimatePresence>
        {displayModalDiscovery === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.login}
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
              <button className={styles.login__btn} onClick={() => closeForm()}>
                <Image
                  className={styles.login__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.login__h1}>Rendez-vous de découverte</h1>
              <p>
                Le coaching débutera par une première séance dite de «
                découverte ». Il s’agit d’une séance de rencontre de 30 à 45
                minutes qui est le point de départ de tout travail en coaching.
                Elle a notamment pour but de faire connaissance, d’évaluer la
                problématique du coaché et de s’assurer qu’elle est du domaine
                de compétence du coaching. A ce stade, le coach pourra orienter
                le coaché vers d’autres professionnels si nécessaire.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DiscoveryModal;
