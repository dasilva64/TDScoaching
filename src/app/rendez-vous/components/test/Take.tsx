import React, { useEffect } from "react";
import styles from "./Take.module.scss";
import Image from "@/app/components/image/Image";
import { useDispatch, useSelector } from "react-redux";
import { mutate as globalMutate } from "swr"
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { RootState } from "@/app/redux/store/store";

const Take = ({ offre, mutate, meetingsByUser }: { offre: any, mutate: any, meetingsByUser: any }) => {
  const dispatch = useDispatch();
  const router = useRouter()
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
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
  /* const { data: dataSee, trigger: triggerSee, isMutating: isMutatingSee, reset: resetSee } = useSWRMutation("/rendez-vous/components/test/api/take/see", fetchPost)
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
  }, [dataSee, dispatch, resetSee, router]) */
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
              <span className={styles.test__offre__container__content__strong}>{offre.type === "flash" ? "Restant à payer" : "Tarif"} :&nbsp;</span>
              {offre.type === "discovery" ? "Gratuit" : offre.type === "unique" ? "100€" : offre.currentNumberOfMeeting < 4 ? ((3 - offre.currentNumberOfMeeting) * 100) + "€" : "0€"}
            </p>
            <p className={styles.test__offre__container__content}>
              <span className={styles.test__offre__container__content__strong}>Rendez-vous en cours :&nbsp;</span>
              {offre.currentNumberOfMeeting === null
                ? 0
                : offre.currentNumberOfMeeting}
              /{offre.type === "discovery" ? "1" : offre.type === "flash" ? "4" : "1"}
            </p>
            {meetingsByUser.length > 0 && offre.type === "flash" && (
              <>
                <div className={styles.test__offre__container__historique}>
                  <p className={styles.test__offre__container__historique__text}>Vous pouvez voir les précédents rendez-vous de cette offre en cliquant sur le bouton ci dessous</p>
                  <div className={styles.test__offre__container__action}>
                    <button onClick={() => {
                      dispatch({
                        type: "ModalHistoriqueMeetingRendezVous/open"
                      })
                    }} className={`${styles.test__offre__container__action__btn} ${styles.test__card__action__btn__edit}`}>Voir les anciens rendez-vous</button>
                  </div>

                </div>
              </>
            )}
            {offre.type === "flash" && (
              <>

                <div className={styles.test__offre__container__action}>
                  {!isMutatingSee && (
                    <button
                      className={styles.test__offre__container__action__btn}
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
                        styles.test__offre__container__action__btn__load
                      }
                    >
                      <span
                        className={
                          styles.test__offre__container__action__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.test__offre__container__action__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.test__offre__container__action__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  )}
                </div>


              </>
            )}
            {offre.type !== "discovery" && (
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
        </div>
        <p onClick={() => {
          console.log('test')
          dispatch({
            type: "ModalHelpRendezVous/open"
          })
        }} className={styles.test__help}>Comment ça marche ?</p>
      </div>

    </>
  );
};

export default Take;
