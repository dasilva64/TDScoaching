import React, { useEffect, useState } from "react";
import styles from "./My.module.scss";
import Image from "@/app/components/image/Image";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { RootState } from "@/app/redux/store/store";
import { useRouter } from "next/navigation";
import { mutate as globalMutate } from "swr"

const My = ({ meeting, offre, mutate }: any) => {
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch();
  let current = new Date();
  const router = useRouter()
  current.setHours(current.getHours() + 5);
  const [confirmationDeadline, setConfirmationDeadline] = useState<Date | null>(null);

  useEffect(() => {
    const deadline = new Date(meeting.startAt);
    deadline.setHours(deadline.getHours() - 12);
    setConfirmationDeadline(deadline);
  }, [meeting.startAt]);
  const { data, trigger, isMutating, reset } = useSWRMutation("/rendez-vous/components/test/api/my/new", fetchPost)
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate()
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        globalMutate("/components/header/api");
        reset()
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        reset()
        router.push('/')
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset()
      }
    }
  }, [data, reset, dispatch, mutate, router])
  const { data: dataSee, trigger: triggerSee, reset: resetSee, isMutating: isMutatingSee } = useSWRMutation("/rendez-vous/components/test/api/take/see", fetchPost)
  useEffect(() => {
    if (dataSee) {
      if (dataSee.status === 200) {
        resetSee();
        window.open(dataSee.body, '_ blank')
      } else if (dataSee.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: dataSee.message,
          },
        });
        resetSee();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else {
        resetSee();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: dataSee.message,
          },
        });
      }
    }
  }, [dataSee, dispatch, resetSee, router])
  /* const { data: dataSee, trigger: triggerSee, isMutating: isMutatingSee, reset: resetSee } = useSWRMutation("/rendez-vous/components/test/api/my/see", fetchPost)
  useEffect(() => {
    if (dataSee) {
      if (dataSee.status === 200) {
        resetSee();
        mutate()
        window.open(dataSee.body, '_ blank')
      } else if (dataSee.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: dataSee.message,
          },
        });
        resetSee();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else {
        resetSee();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: dataSee.message,
          },
        });
      }
    }
  }, [dataSee, dispatch, resetSee, router]) */

  const { data: dataCardStripe, trigger: triggerCardStripe, isMutating: isMutatingCardStripe, reset: resetCardStripe } = useSWRMutation("/rendez-vous/components/test/api/my/cardStripe", fetchPost)
  useEffect(() => {
    if (dataCardStripe) {
      if (dataCardStripe.status === 200) {
        mutate()
        resetCardStripe()
        globalMutate("/components/header/api");
        dispatch({
          type: "ModalAddCardStripe/open",
          payload: {
            secret: dataCardStripe.body
          }
        });
      } else if (dataCardStripe.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataCardStripe.message },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        resetCardStripe()
        router.push('/')
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataCardStripe.message },
        });
        resetCardStripe()
      }
    }
  }, [dataCardStripe, resetCardStripe, dispatch, mutate, router])
  return (
    <>
      <div className={styles.test}>
        <h1 className={styles.test__title}>Rendez-vous à venir</h1>
        <div className={styles.test__card}>
          <div className={`${styles.test__card__title} ${meeting.status === "expired" ? styles.test__card__title__opacity : styles.test__card__title__noOpacity}`}>
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
          <div className={`${styles.test__card__recap} ${meeting.status === "expired" ? styles.test__card__recap__opacity : styles.test__card__recap__noOpacity}`}>
            <h2 className={styles.test__card__recap__title}>Détails du rendez-vous</h2>

            <p className={styles.test__card__recap__p}>
              <span className={styles.test__card__recap__p__strong}>{offre.type === "discovery" ? "Type du rendez-vous : " : "Type de l'offre : "}&nbsp;</span>

              {offre.type === "discovery" ? "Découverte" : String(offre.type)[0].toUpperCase() + "" + String(offre.type).slice(1)}
            </p>
            {offre.type === "flash" && (
              <>
                {!isMutatingSee && (
                  <button
                    className={styles.test__card__recap__btn}
                    onClick={() => {
                      const fetchContract = async () => {
                        triggerSee({
                          csrfToken: csrfToken
                        })
                      }
                      fetchContract()
                    }}
                  >
                    Consulter le contrat de prestation
                  </button>
                )}
                {isMutatingSee && (
                  <button
                    disabled
                    className={
                      styles.test__card__recap__btn__load
                    }
                  >
                    <span
                      className={
                        styles.test__card__recap__btn__load__span
                      }
                    >
                      Chargement
                    </span>

                    <div
                      className={
                        styles.test__card__recap__btn__load__arc
                      }
                    >
                      <div
                        className={
                          styles.test__card__recap__btn__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
              </>
            )}
            <p className={`${styles.test__card__recap__p} ${styles.test__card__recap__p__align}`}>
              <span className={styles.test__card__recap__p__strong}>Type de coaching :&nbsp;</span> {" "}
              {String(offre.coaching)[0].toUpperCase()}{String(offre.coaching).slice(1)}
            </p>
            <p className={styles.test__card__recap__p}>
              <span className={styles.test__card__recap__p__strong}>Durée :&nbsp;</span> {" "}
              1h
            </p>
            <p className={styles.test__card__recap__p}>
              <span className={styles.test__card__recap__p__strong}>Tarif :&nbsp;</span>
              {" "}{offre.type === "discovery" ? "Gratuit" : offre.type === "unique" ? "100€" : offre.type === "flash" ? "3X100€" : "nX100€"}
            </p>
            <p className={styles.test__card__recap__p}>
              <span className={styles.test__card__recap__p__strong}>Rendez-vous en cours :&nbsp;</span> {" "}
              {offre.currentNumberOfMeeting} / {["discovery", "unique"].includes(offre.type) ? "1" : "4"} {offre.currentNumberOfMeeting === 4 && <strong>&nbsp;(Bilan offert)</strong>}
            </p>
            <p className={styles.test__card__recap__p}>
              <span className={styles.test__card__recap__p__strong}>Visioconférence :&nbsp;</span> {" "}
              Pas de lien pour le moment
            </p>


          </div>

          <div className={styles.test__card__line}></div>
          {offre.type === "flash" && (
            <>
              <div className={styles.test__card__historique}>
                <h3 className={styles.test__card__historique__title}>Historique</h3>
                <p className={styles.test__card__historique__text}>Vous pouvez voir les précédents rendez-vous de cette offre en cliquant sur le bouton ci dessous</p>
                <div className={styles.test__card__action}>
                  <button onClick={() => {
                    dispatch({
                      type: "ModalHistoriqueMeetingRendezVous/open"
                    })
                  }} className={`${styles.test__card__action__btn} ${styles.test__card__action__btn__edit}`}>Voir les anciens rendez-vous</button>
                </div>

              </div>
              <div className={styles.test__card__line}></div>
            </>
          )}
          {offre.type === "unique" && (
            <>

              <div className={styles.test__card__confirm}>
                <h3 className={styles.test__card__confirm__title}>Gestion</h3>
                {!offre.hasCard && meeting.status === "not_confirmed" && (
                  <>
                    <p className={styles.test__card__confirm__text}>
                      ⚠️ Vous n’avez pas encore ajouté votre carte pour le paiement automatique de ce rendez-vous.
                    </p>
                    <p className={styles.test__card__confirm__text}>
                      <strong className={styles.test__card__confirm__text__strong}>Attention</strong> : Vous avez jusqu’au {new Date(confirmationDeadline!).toLocaleString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })} pour enregistrer votre carte. Passé ce délai, le rendez-vous expirera automatiquement.
                    </p>
                    <div className={styles.test__card__action}>
                      {!isMutatingCardStripe &&
                        (
                          <button
                            className={`${styles.test__card__confirm__btn}`}
                            onClick={() => {
                              triggerCardStripe({ csrfToken: csrfToken })
                            }
                            }

                          >
                            Ajouter la carte
                          </button>

                        )}
                      {isMutatingCardStripe && (
                        <button
                          disabled
                          className={
                            styles.test__card__confirm__btn__load
                          }
                        >
                          <span
                            className={
                              styles.test__card__confirm__btn__load__span
                            }
                          >
                            Chargement
                          </span>

                          <div
                            className={
                              styles.test__card__confirm__btn__load__arc
                            }
                          >
                            <div
                              className={
                                styles.test__card__confirm__btn__load__arc__circle
                              }
                            ></div>
                          </div>
                        </button>
                      )}
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
                            type: "ModalCancelMeetingRendezVous/open",
                            payload: { type: offre.type },
                          });
                        }}
                      >
                        Supprimer mon rendez-vous
                      </button>
                    </div>

                  </>
                )}
                {offre.hasCard && meeting.status === "not_confirmed" && (
                  <>
                    <p className={styles.test__card__confirm__text}>
                      ⚠️ Vous n’avez pas encore confirmé votre rendez-vous.
                    </p>
                    <p className={styles.test__card__confirm__text}>
                      <strong className={styles.test__card__confirm__text__strong}>Attention</strong> : Vous avez jusqu’au {new Date(confirmationDeadline!).toLocaleString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })} pour le confirmer. Passé ce délai, le rendez-vous expirera automatiquement.
                    </p>

                    <div className={styles.test__card__action}>

                      <button
                        className={`${styles.test__card__confirm__btn}`}
                        onClick={() => {
                          dispatch({
                            type: "ModalConfirmPaidMeetingRendezVous/open",
                          });
                        }
                        }

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
                            type: "ModalCancelMeetingRendezVous/open",
                            payload: { type: offre.type },
                          });
                        }}
                      >
                        Supprimer mon rendez-vous
                      </button>
                    </div>
                  </>
                )}
                {meeting.status === "confirmed" && (
                  <>
                    {current < new Date(meeting.startAt) && (
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
                              type: "ModalCancelMeetingRendezVous/open",
                              payload: { type: offre.type },
                            });
                          }}
                        >
                          Supprimer mon rendez-vous
                        </button>
                      </div>
                    )}
                    {current > new Date(meeting.startAt) && (
                      <>
                        <p className={styles.test__card__confirm__text}>
                          Ce rendez-vous est imminent. Pour toute modification ou suppression, merci de nous contacter directement.
                        </p>
                      </>
                    )}
                  </>

                )}
                {meeting.status === "expired" && (
                  <>
                    <p className={styles.test__card__confirm__text}>Votre rendez-vous a expiré car vous ne l&apos;avez pas confirmé a temps.</p>
                    <div className={styles.test__card__action}>
                      {!isMutating && (
                        <button
                          className={styles.test__card__confirm__btn}
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
                            styles.test__card__confirm__btn__load
                          }
                        >
                          <span
                            className={
                              styles.test__card__confirm__btn__load__span
                            }
                          >
                            Chargement
                          </span>

                          <div
                            className={
                              styles.test__card__confirm__btn__load__arc
                            }
                          >
                            <div
                              className={
                                styles.test__card__confirm__btn__load__arc__circle
                              }
                            ></div>
                          </div>
                        </button>
                      )}

                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {offre.type === "flash" && (
            <>
              <div className={styles.test__card__confirm}>
                <h3 className={styles.test__card__confirm__title}>Gestion</h3>
                {meeting.status === "not_confirmed" && (
                  <>
                    {/* {offre.payment && (
                      <>
                        <p className={styles.test__card__confirm__text}>
                          Vous devez confirmer le rendez-vous 24h avant la date du
                          rendez-vous sinon il sera automatiquement supprimé
                        </p>
                      </>
                    )} */}
                    <p className={styles.test__card__confirm__text}>
                      ⚠️ Vous n’avez pas encore confirmé votre rendez-vous.
                    </p>
                    <p className={styles.test__card__confirm__text}>
                      <strong className={styles.test__card__confirm__text__strong}>Attention</strong> : Vous avez jusqu’au {new Date(confirmationDeadline!).toLocaleString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })} pour confirmer votre rendez-vous. Passé ce délai, le rendez-vous expirera automatiquement.
                    </p>

                    <div className={styles.test__card__action}>
                      {!isMutatingCardStripe &&
                        (
                          <button
                            className={`${styles.test__card__confirm__btn}`}
                            onClick={() => {
                              dispatch({
                                type: "ModalConfirmMeetingRendezVous/open",
                                payload: { date: meeting.startAt },
                              });
                            }
                            }

                          >
                            Confirmer mon rendez-vous
                          </button>

                        )}
                      {isMutatingCardStripe && (
                        <button
                          disabled
                          className={
                            styles.test__card__confirm__btn__load
                          }
                        >
                          <span
                            className={
                              styles.test__card__confirm__btn__load__span
                            }
                          >
                            Chargement
                          </span>

                          <div
                            className={
                              styles.test__card__confirm__btn__load__arc
                            }
                          >
                            <div
                              className={
                                styles.test__card__confirm__btn__load__arc__circle
                              }
                            ></div>
                          </div>
                        </button>
                      )}
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
                            type: "ModalCancelMeetingRendezVous/open",
                            payload: { type: offre.type },
                          });
                        }}
                      >
                        Supprimer mon rendez-vous
                      </button>
                    </div>
                  </>
                )}
                {meeting.status === "confirmed" && (
                  <>
                    {current < new Date(meeting.startAt) && (
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
                              type: "ModalCancelMeetingRendezVous/open",
                              payload: { type: offre.type },
                            });
                          }}
                        >
                          Supprimer mon rendez-vous
                        </button>
                      </div>
                    )}
                    {current > new Date(meeting.startAt) && (
                      <>
                        <p className={styles.test__card__confirm__text}>
                          Ce rendez-vous est imminent. Pour toute modification ou suppression, merci de nous contacter directement.
                        </p>
                      </>
                    )}
                  </>

                )}
                {meeting.status === "expired" && (
                  <>
                    <p className={styles.test__card__confirm__text}>Votre rendez-vous a expiré car vous ne l&apos;avez pas confirmé a temps.</p>
                    <div className={styles.test__card__action}>
                      {!isMutating && (
                        <button
                          className={styles.test__card__confirm__btn}
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
                            styles.test__card__confirm__btn__load
                          }
                        >
                          <span
                            className={
                              styles.test__card__confirm__btn__load__span
                            }
                          >
                            Chargement
                          </span>

                          <div
                            className={
                              styles.test__card__confirm__btn__load__arc
                            }
                          >
                            <div
                              className={
                                styles.test__card__confirm__btn__load__arc__circle
                              }
                            ></div>
                          </div>
                        </button>
                      )}

                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {offre.type === "discovery" && (
            <>
              <div className={styles.test__card__confirm}>
                <h3 className={styles.test__card__confirm__title}>Gestion</h3>
                {meeting.status === "not_confirmed" && (
                  <>
                    <p className={styles.test__card__confirm__text}>
                      ⚠️ Vous n’avez pas encore confirmé votre rendez-vous.
                    </p>
                    <p className={styles.test__card__confirm__text}>
                      <strong className={styles.test__card__confirm__text__strong}>Attention</strong> : Vous avez jusqu’au {new Date(confirmationDeadline!).toLocaleString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })} pour confirmer votre rendez-vous. Passé ce délai, le rendez-vous expirera automatiquement.
                    </p>
                    <div className={styles.test__card__action}>
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
                        Modifier mon rendez-vous
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
                  </>
                )}
                {meeting.status === "confirmed" && (
                  <>
                    {current < new Date(meeting.startAt) && (
                      <>
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
                      </>
                    )}
                    {current > new Date(meeting.startAt) && (
                      <>
                        <p className={styles.test__card__confirm__text}>
                          Ce rendez-vous est imminent. Pour toute modification ou suppression, merci de nous contacter directement.
                        </p>
                      </>
                    )}

                  </>

                )}
                {meeting.status === "expired" && (
                  <>
                    <p className={styles.test__card__confirm__text}>Votre rendez-vous a expiré car vous ne l&apos;avez pas confirmé a temps.</p>
                    <div className={styles.test__card__action}>
                      {!isMutating && (
                        <button
                          className={styles.test__card__confirm__btn}
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
                            styles.test__card__confirm__btn__load
                          }
                        >
                          <span
                            className={
                              styles.test__card__confirm__btn__load__span
                            }
                          >
                            Chargement
                          </span>

                          <div
                            className={
                              styles.test__card__confirm__btn__load__arc
                            }
                          >
                            <div
                              className={
                                styles.test__card__confirm__btn__load__arc__circle
                              }
                            ></div>
                          </div>
                        </button>
                      )}

                    </div>
                  </>
                )}
              </div>
            </>
          )}
          <div className={styles.test__card__line}></div>
          <div className={styles.test__card__contact}>
            <h3 className={styles.test__card__contact__title}>Contact</h3>
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
