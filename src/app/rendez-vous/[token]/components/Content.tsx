"use client";

import React, { useEffect, useState } from "react";
import styles from "./Content.module.scss";
import Image from "@/app/components/image/Image";
//import "../../rendez-vous.scss";
import { usePathname, useRouter } from "next/navigation";
import useGetOneByToken from "@/app/components/hook/meeting/useGetOneByToken";
import { useDispatch, useSelector } from "react-redux";
import ModalCalendarEditDiscoveryMeeting from "./modal/editCalendar/ModalCalendarEditDiscoveryMeeting";
import ModalDeleteDiscoveryMeeting from "./modal/delete/ModalDeleteDiscoveryMeeting";
import ModalComfirmDiscoveryMeeting from "./modal/confirm/ModalComfirmDiscoveryMeeting";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import ModalEditDiscoveryMeeting from "./modal/edit/ModalEditDiscoveryMeeting";
import Load from "./load/Load";
import NoScript from "@/app/components/noscript/NoScript";

const Content = () => {
  const queryParam: any = usePathname();
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  let token = queryParam.toString().split("/");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  const { data, isLoading, mutate } = useGetOneByToken(token[2], csrfToken);
  const [allData, setAllData] = useState<any[]>([]);
  let current = new Date();
  current.setHours(current.getHours() + 5);
  const [confirmationDeadline, setConfirmationDeadline] = useState<Date | null>(null);

  useEffect(() => {
    if (data) {

      if (data.status === 200) {
        const deadline = new Date(data.body.meeting.startAt);
        deadline.setHours(deadline.getHours() - 12);
        setConfirmationDeadline(deadline);
      }
    }

  }, [data]);
  useEffect(() => {
    if (data) {

      if (data.status === 200) {
        let array = [];
        for (let i = 0; i < data.body.meetings.length; i++) {
          if (data.body.id === data.body.meetings[i].User.id) {
            array.push({
              start: data.body.meetings[i].startAt,
              startEditable: true,
              backgroundColor: "green",
              textColor: "white",
              title: "Mon rendez-vous",
            });
          } else {
            array.push({
              start: data.body.meetings[i].startAt,
              startEditable: false,
              backgroundColor: "red",
              textColor: "red",
            });
          }
        }
        setAllData(array);
      }
    }
  }, [data, dispatch, router]);

  return (
    <>
      {data && (
        <>
          {data.body && (
            <>
              <ModalCalendarEditDiscoveryMeeting
                token={token[2]}
                allMeeting={allData}
                startMeet={data.body.meeting.startAt}

              />
              <ModalDeleteDiscoveryMeeting token={token[2]} />
              <ModalComfirmDiscoveryMeeting globalData={data} token={token[2]} mutate={mutate} />
              <ModalEditDiscoveryMeeting
                globalData={data}
                mutate={mutate}
                token={token[2]}
                meeting={data.body.meeting}
                offre={data.body.offre}
              />
            </>
          )}
        </>
      )}
      <NoScript />
      {!isLoading && (
        <>
          {data && data.body && (
            <>
              <div className={styles.container}><div className={styles.content}>
                <h3 className={styles.content__title}>Rendez-vous à venir</h3>
                <div className={styles.content__card}>
                  <div className={styles.content__card__title}>
                    <p className={styles.content__card__title__p}>
                      <Image
                        className={styles.content__card__title__p__img}
                        src="/assets/icone/calendar-regular.svg"
                        alt="clock"
                        width={25}
                        height={25}
                      />
                      {new Date(data.body.meeting.startAt).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p
                      className={`${styles.content__card__title__p} ${styles.content__card__title__p__space}`}
                    >
                      <Image
                        className={styles.content__card__title__p__img}
                        src="/assets/icone/clock-solid.svg"
                        alt="clock"
                        width={25}
                        height={25}
                      />
                      {new Date(data.body.meeting.startAt).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>

                  <div className={`${styles.content__card__recap} ${data.body.meeting.status === "expired" ? styles.content__card__recap__opacity : styles.content__card__recap__noOpacity}`}>
                    <h2 className={styles.content__card__recap__title}>Détails du rendez-vous</h2>

                    <p className={styles.content__card__recap__p}>
                      <span className={styles.content__card__recap__p__strong}>Type du rendez-vous :&nbsp;</span>

                      Découverte
                    </p>
                    <p className={`${styles.content__card__recap__p} ${styles.content__card__recap__p__align}`}>
                      <span className={styles.content__card__recap__p__strong}>Type de coaching :&nbsp;</span> {" "}
                      {String(data.body.offre.coaching)[0].toUpperCase()}{String(data.body.offre.coaching).slice(1)}
                    </p>
                    <p className={styles.content__card__recap__p}>
                      <span className={styles.content__card__recap__p__strong}>Durée :&nbsp;</span> {" "}
                      1h
                    </p>
                    <p className={styles.content__card__recap__p}>
                      <span className={styles.content__card__recap__p__strong}>Tarif :&nbsp;</span>
                      Gratuit
                    </p>
                    <p className={styles.content__card__recap__p}>
                      <span className={styles.content__card__recap__p__strong}>Rendez-vous en cours :&nbsp;</span> {" "}
                      {data.body.offre.currentNumberOfMeeting} / 1
                    </p>
                    <p className={styles.content__card__recap__p}>
                      <span className={styles.content__card__recap__p__strong}>Visioconférence :&nbsp;</span> {" "}
                      Pas de lien pour le moment
                    </p></div>

                  <div className={styles.content__card__line}></div>
                  <div className={styles.content__card__confirm}>
                    <h3 className={styles.content__card__confirm__title}>Gestion</h3>
                    {data.body.meeting.status === "not_confirmed" && (
                      <>
                        <p className={styles.content__card__confirm__text}>
                          ⚠️ Vous n’avez pas encore confirmé votre rendez-vous.
                        </p>
                        <p className={styles.content__card__confirm__text}>
                          <strong className={styles.content__card__confirm__text__strong}>Attention</strong> : Vous avez jusqu’au {new Date(confirmationDeadline!).toLocaleString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric"
                          })} pour confirmer votre rendez-vous. Passé ce délai, le rendez-vous expirera automatiquement.
                        </p>
                        <div className={styles.content__card__action}>
                          <button
                            className={`${styles.content__card__confirm__btn}`}
                            onClick={() => {
                              dispatch({
                                type: "ModalConfirmDiscoveryMeetingRendezVousToken/open",
                                payload: { date: data.body.meeting.startAt },
                              });
                            }}
                          >
                            Confirmer mon rendez-vous
                          </button>
                          <button
                            className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__edit}`}
                            onClick={() => {
                              dispatch({
                                type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/open",
                              });
                            }}
                          >
                            Modifier mon rendez-vous
                          </button>
                          <button
                            className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__delete}`}
                            onClick={() => {
                              dispatch({
                                type: "ModalDeleteDiscoveryMeetingRendezVousToken/open",
                              });
                            }}
                          >
                            Supprimer mon rendez-vous
                          </button>
                        </div>
                      </>
                    )}
                    {data.body.meeting.status === "confirmed" && (
                      <>
                        {current < new Date(data.body.meeting.startAt) && (
                          <div className={styles.content__card__action}>
                            <button
                              className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__edit}`}
                              onClick={() => {
                                dispatch({
                                  type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/open",
                                });
                              }}
                            >
                              Déplacer mon rendez-vous
                            </button>
                            <button
                              className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__delete}`}
                              onClick={() => {
                                dispatch({
                                  type: "ModalDeleteDiscoveryMeetingRendezVousToken/open",
                                });
                              }}
                            >
                              Supprimer mon rendez-vous
                            </button>
                          </div>
                        )}
                        {current > new Date(data.body.meeting.startAt) && (
                          <>
                            <p className={styles.test__card__confirm__text}>
                              Ce rendez-vous est imminent. Pour toute modification ou suppression, merci de nous contacter directement.
                            </p>
                          </>
                        )}
                      </>


                    )}
                    {data.body.meeting.status === "expired" && (
                      <>
                        <p className={styles.content__card__confirm__text}>Votre rendez-vous a expiré car vous ne l&apos;avez pas confirmé a temps.</p>
                        <div className={styles.content__card__action}>
                          {/* {!isMutating && (
                        <button
                          className={styles.content__card__confirm__btn}
                          onClick={() => {
                            trigger({ csrfToken: csrfToken })
                          }}
                        >
                          Reprendre un rendez-vous
                        </button>
                      )}
                      {isMutating && (
                        <button
                          disabled
                          className={
                            styles.content__card__confirm__btn__load
                          }
                        >
                          <span
                            className={
                              styles.content__card__confirm__btn__load__span
                            }
                          >
                            Chargement
                          </span>

                          <div
                            className={
                              styles.content__card__confirm__btn__load__arc
                            }
                          >
                            <div
                              className={
                                styles.content__card__confirm__btn__load__arc__circle
                              }
                            ></div>
                          </div>
                        </button>
                      )} */}

                        </div>
                      </>
                    )}
                  </div>
                  {/* {!data.body.meeting.confirm && (
            <div className={styles.content__card__confirm}>
              <p className={styles.content__card__confirm__text}>
                Vous devez confirmer le rendez-vous 24h avant la date du
                rendez-vous sinon il sera automatiquement supprimé
              </p>
              <div className={styles.content__card__action}>
                {data.body.offre.type === "unique" && (
                  <>
                    <button
                      className={`${styles.content__card__confirm__btn}`}
                      onClick={() => {
                        dispatch({
                          type: "ModalConfirmPaidMeetingRendezVous/open",
                          payload: { date: data.body.meeting.startAt },
                        });
                      }}
                    >
                      Confirmer mon rendez-vous
                    </button>
                    <button
                      className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__delete}`}
                      onClick={() => {
                        dispatch({
                          type: "ModalCancelMeetingRendezVous/open",
                          payload: { date: data.body.meeting.startAt },
                        });
                      }}
                    >
                      Annuler mon rendez-vous
                    </button>
                  </>
                )}
                {data.body.offre.type === "discovery" && (
                  <>
                    <button
                      className={`${styles.content__card__confirm__btn}`}
                      onClick={() => {
                        dispatch({
                          type: "ModalConfirmDiscoveryMeetingRendezVousToken/open",
                        });
                      }}
                    >
                      Confirmer mon rendez-vous
                    </button>
                    <button
                className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__edit}`}
                onClick={() => {
                  dispatch({
                    type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/open",
                  });
                }}
              >
                Déplacer mon rendez-vous
              </button>
                    <button
                      className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__delete}`}
                      onClick={() => {
                        dispatch({
                          type: "ModalDeleteDiscoveryMeetingRendezVousToken/open",
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
          {data.body.offre.confirm && (
            <div className={styles.content__card__action}>
              <button
                className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__edit}`}
                onClick={() => {
                  dispatch({
                    type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/open",
                  });
                }}
              >
                Déplacer mon rendez-vous
              </button>
              <button
                className={`${styles.content__card__action__btn} ${styles.content__card__action__btn__delete}`}
                onClick={() => {
                  dispatch({
                    type: "ModalDeleteDiscoveryMeetingRendezVousToken/open",
                  });
                }}
              >
                Supprimer mon rendez-vous
              </button>
            </div>
          )} */}
                  <div className={styles.content__card__line}></div>
                  <div className={styles.content__card__contact}>
                    <h3 className={styles.content__card__contact__title}>Contact</h3>
                    <p>
                      Si vous rencontrer un problème avec le rendez-vous ou le lien de
                      visioconférence veuillez me contacter :
                    </p>
                    <ul className={styles.content__card__contact__ul}>
                      <li className={styles.content__card__contact__ul__li}>
                        <Image
                          src="/assets/icone/envelope-at-fill.svg"
                          alt="clock"
                          width={20}
                          height={20}
                        />
                        <a
                          className={styles.content__card__contact__ul__li__a}
                          href="mailto:contact@tds-coachingdevie.fr"
                        >
                          contact@tds-coachingdevie.fr
                        </a>
                      </li>
                      <li className={styles.content__card__contact__ul__li}>
                        <Image
                          src="/assets/icone/phone-solid.svg"
                          alt="clock"
                          width={20}
                          height={20}
                        />
                        <a
                          className={styles.content__card__contact__ul__li__a}
                          href="tel:+33781673125"
                        >
                          0781673125
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div></div>


              {/* <div className={styles.content}>
  <div className={styles.content__card}><Image
              src="/assets/icone/calendar-page.png"
              alt=""
              width={60}
              height={60}
            />
            <div className={styles.content__meet}>
              <p className={styles.content__meet__title}>
                Votre prochain rendez-vous
              </p>
              <p className={styles.content__meet__p}>
                <Image
                  className={styles.content__meet__p__img}
                  src="/assets/icone/calendar-regular.svg"
                  alt="clock"
                  width={20}
                  height={20}
                />
                {" : "}
                {new Date(data.body.meet.startAt).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className={styles.content__meet__p}>
                <Image
                  className={styles.content__meet__p__img}
                  src="/assets/icone/clock-solid.svg"
                  alt="clock"
                  width={20}
                  height={20}
                />
                {" : "}
                {new Date(data.body.meet.startAt).toLocaleTimeString("fr-FR")}
              </p>
              <p className={styles.content__meet__p}>
                <Image
                  className={styles.content__meet__p__img}
                  src="/assets/icone/coach.png"
                  alt="clock"
                  width={20}
                  height={20}
                />
                {" : "}
                {"Découverte"}
              </p>
            </div>
            {data.body.meet.confirm === false && (
              <>
                <p className={styles.content__p}>
                  Attention ce rendez-vous n&apos;est pas encore confirmé,
                  veuillez le confimer 24h avant la date du rendez-vous sinon il
                  sera automatiquement supprimé.
                </p>
                <div
                  className={`${styles.content__action} ${styles.content__action__confirm}`}
                >
                  <button
                    className={styles.content__action__btn__confirm}
                    onClick={() => {
                      dispatch({
                        type: "ModalConfirmDiscoveryMeetingRendezVousToken/open",
                      });
                    }}
                  >
                    Confirmer le rendez-vous
                  </button>
                </div>
              </>
            )}
            {data.body.meet.confirm === true && (
              <>
                <p className={styles.content__p}>
                  Votre rendez-vous est bien confirmé
                </p>
              </>
            )}
            <div
              className={`${styles.content__action} ${styles.content__action__edit}`}
            >
              <button
                className={styles.content__action__btn}
                onClick={() => {
                  dispatch({
                    type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/open",
                  });
                }}
              >
                Modifier le rendez-vous
              </button>
              <button
                className={styles.content__action__btn__delete}
                onClick={() => {
                  dispatch({
                    type: "ModalDeleteDiscoveryMeetingRendezVousToken/open",
                  });
                }}
              >
                Supprimer le rendez-vous
              </button>
            </div>
            <p className={styles.content__p}>
              Si le rendez n&apos;est pas confirmer 24h avant alors il sera
              automatiquement supprimer.
            </p>
            <p className={styles.content__p}>
              Vous ne pouvez modifier ou supprimer le rendez-vous 24h avant le
              date du rendez-vous.
            </p></div>
            
          </div> */}


            </>
          )}

        </>
      )}
      {isLoading && (
        <>
          <Load />
        </>
      )}
    </>
  );
};

export default Content;
