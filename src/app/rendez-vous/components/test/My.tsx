import React from "react";
import styles from "./My.module.scss";
import Image from "next/image";
import { useDispatch } from "react-redux";

const My = ({ meeting }: any) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.test}>
        <h3 className={styles.test__title}>Rendez-vous à venir</h3>
        <div className={styles.test__card}>
          <div className={styles.test__card__title}>
            <p className={styles.test__card__title__p}>
              <Image
                className={styles.test__card__title__p__img}
                src="/assets/icone/calendar-regular.svg"
                alt="clock"
                width={25}
                height={25}
              />
              {new Date(meeting.startAt).toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p
              className={`${styles.test__card__title__p} ${styles.test__card__title__p__space}`}
            >
              <Image
                className={styles.test__card__title__p__img}
                src="/assets/icone/clock-solid.svg"
                alt="clock"
                width={25}
                height={25}
              />
              {new Date(meeting.startAt).toLocaleTimeString("fr-FR")}
            </p>
          </div>

          <p className={styles.test__card__p}>
            <Image
              className={styles.test__card__p__img}
              src="/assets/icone/coach.png"
              alt="clock"
              width={20}
              height={20}
            />
            {meeting.type === "discovery" ? "Découverte" : String(meeting.type)[0].toUpperCase() + "" + String(meeting.type).slice(1)}
          </p>
          <p className={`${styles.test__card__p} ${styles.test__card__p__align}`}>
            <Image
              className={styles.test__card__p__img}
              src="/assets/icone/handshake.png"
              alt="clock"
              width={20}
              height={20}
            />
            {String(meeting.coaching)[0].toUpperCase()}{String(meeting.coaching).slice(1)}
          </p>

          <p className={styles.test__card__p}>
            <Image
              className={styles.test__card__p__img}
              src="/assets/icone/video-solid.svg"
              alt="clock"
              width={20}
              height={20}
            />
            Lien vers la visio
          </p>
          <div className={styles.test__card__line}></div>
          {!meeting.confirm && (
            <div className={styles.test__card__confirm}>
              <p className={styles.test__card__confirm__text}>
                Vous devez confirmer le rendez-vous 24h avant la date du
                rendez-vous sinon il sera automatiquement supprimé
              </p>
              <div className={styles.test__card__action}>
                {meeting.type === "unique" && (
                  <>
                    <button
                      className={`${styles.test__card__confirm__btn}`}
                      onClick={() => {
                        dispatch({
                          type: "ModalConfirmPaidMeetingRendezVous/open",
                          payload: { date: meeting.startAt },
                        });
                      }}
                    >
                      Confirmer mon rendez-vous
                    </button>
                    <button
                      className={`${styles.test__card__action__btn} ${styles.test__card__action__btn__delete}`}
                      onClick={() => {
                        dispatch({
                          type: "ModalCancelMeetingRendezVous/open",
                          payload: { date: meeting.startAt },
                        });
                      }}
                    >
                      Annuler mon rendez-vous
                    </button>
                  </>
                )}
                {meeting.type === "discovery" && (
                  <>
                    <button
                      className={`${styles.test__card__confirm__btn}`}
                      onClick={() => {
                        dispatch({
                          type: "ModalConfirmMeetingRendezVous/open",
                          payload: { date: meeting.startAt },
                        });
                      }}
                    >
                      Confirmer mon rendez-vous
                    </button>
                    <button
                className={`${styles.test__card__action__btn} ${styles.test__card__action__btn__edit}`}
                onClick={() => {
                  dispatch({
                    type: "ModalCalendarEditMeetingRendezVous/open",
                  });
                }}
              >
                Déplacer mon rendez-vous
              </button>
                    <button
                      className={`${styles.test__card__action__btn} ${styles.test__card__action__btn__delete}`}
                      onClick={() => {
                        dispatch({
                          type: "ModalDeleteMeetingRendezVous/open",
                        });
                      }}
                    >
                      Supprimer mon rendez-vous
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {meeting.confirm && (
            <div className={styles.test__card__action}>
              <button
                className={`${styles.test__card__action__btn} ${styles.test__card__action__btn__edit}`}
                onClick={() => {
                  dispatch({
                    type: "ModalCalendarEditMeetingRendezVous/open",
                  });
                }}
              >
                Déplacer mon rendez-vous
              </button>
              <button
                className={`${styles.test__card__action__btn} ${styles.test__card__action__btn__delete}`}
                onClick={() => {
                  dispatch({
                    type: "ModalDeleteMeetingRendezVous/open",
                  });
                }}
              >
                Supprimer mon rendez-vous
              </button>
            </div>
          )}
          <div className={styles.test__card__line}></div>
          <div className={styles.test__card__contact}>
            <p>
              Si vous rencontrer un problème avec le rendez-vous ou le lien de
              visioconférence veuillez me contacter :
            </p>
            <ul className={styles.test__card__contact__ul}>
              <li className={styles.test__card__contact__ul__li}>
                <Image
                  src="/assets/icone/envelope-at-fill.svg"
                  alt="clock"
                  width={20}
                  height={20}
                />
                <a
                  className={styles.test__card__contact__ul__li__a}
                  href="mailto:contact@tds-coachingdevie.fr"
                >
                  contact@tds-coachingdevie.fr
                </a>
              </li>
              <li className={styles.test__card__contact__ul__li}>
                <Image
                  src="/assets/icone/phone-solid.svg"
                  alt="clock"
                  width={20}
                  height={20}
                />
                <a
                  className={styles.test__card__contact__ul__li__a}
                  href="tel:+33781673125"
                >
                  0781673125
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default My;
