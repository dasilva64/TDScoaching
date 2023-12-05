import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import styles from "./DiscoveryModal.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useSelect } from "@mui/base";

const NormalModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const closeForm = () => {
    dispatch({
      type: "ModalNormal/close",
    });
  };
  const { displayModalNormal } = useSelector(
    (state: RootState) => state.ModalNormal
  );
  useEffect(() => {
    if (displayModalNormal === true) {
      let test = document.querySelectorAll(".modalOpen");
      test.forEach((tab) => {
        tab.setAttribute("tabindex", "-1");
      });
    }
  }, [displayModalNormal]);
  return (
    <>
      <AnimatePresence>
        {displayModalNormal === true && (
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
              <button
                className={styles.login__btn}
                autoFocus
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.login__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.login__h1}>Séance coaching</h1>
              <p className={styles.login__p}>
                <Image
                  className={styles.login__p__icone}
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/clock-solid.svg"}
                  alt="bousole"
                />
                : 45mn / 1h
              </p>
              <p className={styles.login__p}>
                <Image
                  className={styles.login__p__icone}
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/location-dot-solid.svg"}
                  alt="bousole"
                />
                : En distanciel (Visio)
              </p>
              <p className={styles.login__p}>
                <Image
                  className={styles.login__p__icone}
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/dollar-sign-solid.svg"}
                  alt="bousole"
                />
                : par carte bancaire
              </p>
              <p className={styles.tarif__next__container__content__p}>
                Ensuite, le véritable travail de coaching commence. Les séances
                de coaching dureront entre 45mn et 1h et seront généralement
                espacées de 2 semaines. Elles permettront de prendre conscience
                du fonctionnement actuel et des blocages.
                <br />
                Vous choisirez un objectif (c’est-à-dire ce sur quoi vous
                souhaitez avancer) qui soit clairement mesurable, contextualisé
                et ne dépendant que de vous. En fonction de votre demande, des
                axes de travail vont apparaître. Vous établirez un plan
                d’actions concrètes pour activer le changement. Nous fixerons
                ensemble le rythme et le cadre des séances. La durée du coaching
                est variable en fonction du travail que vous souhaiterez
                réaliser.
                <br />
                Tout au long des rencontres, nous échangerons sur votre
                accompagnement et sur le processus en cours. Au fur et à mesure,
                vous explorerez de nouvelles pistes et de nouvelles méthodes
                pour aborder les difficultés rencontrées. Le coaching vous
                permettra de prendre conscience de votre potentiel et vous
                aidera à atteindre votre objectif. Le coaching se terminera
                toujours par une séance de « clôture » permettant de valider
                l’atteinte de l’objectif.
                <br />
                Toutes les séances auront lieu en visio avec des outils dédiés.
                Vous n’aurez aucun logiciel à installer.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NormalModal;
