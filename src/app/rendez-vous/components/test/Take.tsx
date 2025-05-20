import React from "react";
import styles from "./Take.module.scss";
import Image from "next/image";
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
            <Image
              className={styles.test__offre__container__content__img}
              src="/assets/icone/critical.png"
              alt=""
              width={20}
              height={20}
            />{" "}
            {offre
              ? String(offre.type).charAt(0).toLocaleUpperCase() +
                String(offre.type).slice(1)
              : "Découverte"}
          </p>
          <p className={styles.test__offre__container__content}>
            <Image
              className={styles.test__offre__container__content__img}
              src="/assets/icone/time.png"
              alt=""
              width={20}
              height={20}
            />{" "}
            1h
          </p>
          <p className={styles.test__offre__container__content}>
            <Image
              className={styles.test__offre__container__content__img}
              src="/assets/icone/euro-sign-solid.svg"
              alt=""
              width={20}
              height={20}
            />{" "}
            {offre ? "100€" : "Gratuit"}
          </p>
          <p className={styles.test__offre__container__content}>
            <Image
              className={styles.test__offre__container__content__img}
              src="/assets/icone/tickets.png"
              alt=""
              width={20}
              height={20}
            />{" "}
            {offre === null
              ? 0
              : offre.currentNumberOfMeeting === null
              ? 0
              : offre.currentNumberOfMeeting}
            /1
          </p>
          {offre && (
            <>
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
      </div></div>
      
    </>
  );
};

export default Take;
