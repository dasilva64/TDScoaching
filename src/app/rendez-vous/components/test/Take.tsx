import React from "react";
import styles from "./Take.module.scss";
import Image from "@/app/components/image/Image";
import { useDispatch } from "react-redux";

const Take = ({ offre }: { offre: any }) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.test}><Image
        src="/assets/icone/calendar-page.png"
        alt=""
        width={60}
        height={60}
      />
        <p className={styles.test__text}>
          Vous n&apos;avez aucun rendez-vous à venir
        </p>
        <div className={styles.test__offre}>
          <p className={styles.test__offre__title}>Votre offre actuelle</p>
          <div className={styles.test__offre__container}>
            <p className={styles.test__offre__container__content}>
              <span className={styles.test__offre__container__content__strong}>{offre.type === "discovery" ? "Type du rendez-vous : " : "Type de l'offre : "}&nbsp;</span>
              {offre.type !== "discovery"
                ? String(offre.type).charAt(0).toLocaleUpperCase() +
                String(offre.type).slice(1)
                : "Découverte"}
            </p>
            <p className={styles.test__offre__container__content}>
              <span className={styles.test__offre__container__content__strong}>Durée :&nbsp;</span>
              {["unique", "discovery"].includes(offre.type)
                ? "1h"
                : (offre.type === "flash"
                  ? "3 × 1h (séances individuelles)"
                  : "1h")}
            </p>
            {offre.type === "flash" && <p className={styles.test__offre__container__content}><span className={styles.test__offre__container__content__strong}>Offert :&nbsp;</span>1 bilan final offert (30 min)</p>}
            <p className={styles.test__offre__container__content}>
              <span className={styles.test__offre__container__content__strong}>Tarif :&nbsp;</span>
              {offre.type === "discovery" ? "Gratuit" : offre.type === "unique" ? "100€" : "300€"}
            </p>
            <p className={styles.test__offre__container__content}>
              <span className={styles.test__offre__container__content__strong}>Rendez-vous en cours :&nbsp;</span>
              {offre.currentNumberOfMeeting === null
                ? 0
                : offre.currentNumberOfMeeting}
              /{offre.type === "discovery" ? "1" : offre.type === "flash" ? "3" : "1"}
            </p>

            {offre.type !== "discovery" && (
              <>
              {offre.currentNumberOfMeeting > 0 && (


                <div className={styles.test__offre__container__action}>
                  <button
                    className={styles.test__offre__container__action__btn}
                    onClick={() => {
                      dispatch({
                        type: "ModalFormuleCancelRendezVous/open",
                        payload: { id: offre.id },
                      });
                    }}
                  >
                    Annuler l&apos;offre
                  </button>
                </div>
              )}
                {(offre.currentNumberOfMeeting === 0 || !offre.currentNumberOfMeeting) && (


                <div className={styles.test__offre__container__action}>
                  <button
                    className={styles.test__offre__container__action__btn}
                    onClick={() => {
                      dispatch({
                        type: "ModalFormuleEditRendezVous/open",
                        payload: { id: offre.id },
                      });
                    }}
                  >
                    Changer d&apos;offre
                  </button>
                </div>
              )}
              </>
            )}
          </div>
        </div>
        <div className={styles.test__action}>
          <button
            className={styles.test__action__btn}
            onClick={() => {
              dispatch({
                type: "ModalCalendarAddMeetingRendezVous/open",
              });
            }}
          >
            Prendre un rendez-vous
          </button>
        </div>
        <p onClick={() => {
          dispatch({
            type: "ModalHelpRendezVous/open"
          })
        }} className={styles.test__help}>Comment ça marche ?</p>
      </div>

    </>
  );
};

export default Take;
