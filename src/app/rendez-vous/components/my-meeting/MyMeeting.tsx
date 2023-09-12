import React from "react";
import styles from "./MyMeeting.module.scss";
import useGet from "@/app/components/hook/useGet";
import { useDispatch } from "react-redux";
import Image from "next/image";

const MyMeeting = () => {
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserMeeting");
  console.log(userData);
  const dispatch = useDispatch();
  return (
    <>
      <div className={`${styles.myMeeting__meeting__visio}`}>
        <h2 className={styles.myMeeting__meeting__visio__h2}>
          visioconférence
        </h2>
        <p className={styles.myMeeting__meeting__visio__p}>
          Ce rendez-vous se fait par visioconférence. Vous recevrez un mail avec
          le lien de connexion 24h avant le rendez-vous.
        </p>
        <p className={styles.myMeeting__meeting__visio__p}>
          Si vous rencontrer un problème avec le lien de connexion veuillez me
          contacter par{" "}
          <a
            className={styles.myMeeting__meeting__visio__a}
            href="mailto:contact@tds-coachingdevie.fr"
          >
            email
          </a>{" "}
          ou par{" "}
          <a
            className={styles.myMeeting__meeting__visio__a}
            href="tel:+33781673125"
          >
            téléphone
          </a>
        </p>
      </div>
      <div className={styles.myMeeting__meeting__detail}>
        <h2 className={styles.myMeeting__meeting__detail__h2}>
          Voici votre prochain rendez-vous
        </h2>
        <div className={styles.myMeeting__meeting__detail__div}>
          <p className={styles.myMeeting__meeting__detail__p}>
            <Image
              className={styles.myMeeting__meeting__detail__p__img}
              src="/assets/icone/calendar-regular.svg"
              alt="clock"
              width={25}
              height={25}
            />
            {" : "}
            {new Date(userData.body.meeting.startAt).toLocaleDateString(
              "fr-FR",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
          <p className={styles.myMeeting__meeting__detail__p}>
            <Image
              className={styles.myMeeting__meeting__detail__p__img}
              src="/assets/icone/clock-solid.svg"
              alt="clock"
              width={25}
              height={25}
            />
            {" : "}
            {new Date(userData.body.meeting.startAt).toLocaleTimeString(
              "fr-FR"
            )}
          </p>

          <p className={styles.myMeeting__meeting__detail__p}>
            <Image
              className={styles.myMeeting__meeting__detail__p__img}
              src="/assets/icone/coach.png"
              alt="clock"
              width={25}
              height={25}
            />
            {" : "}
            {userData.body.meeting.typeMeeting.coaching}
          </p>
        </div>

        <div className={`${styles.myMeeting__meeting__detail__content}`}>
          <div className={styles.myMeeting__meeting__detail__content__submit}>
            <button
              className={`${styles.myMeeting__meeting__detail__content__submit__btn} ${styles.myMeeting__meeting__detail__content__submit__btn__edit}`}
              onClick={() => {
                if (userData.body.meeting) {
                  dispatch({
                    type: "ModalDatePickerEdit/open",
                  });
                } else {
                  dispatch({
                    type: "flash/storeFlashMessage",
                    payload: {
                      type: "error",
                      flashMessage:
                        "Vous n'avez pas de rendez programmé, veuillez réessayer",
                    },
                  });
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }
              }}
            >
              Déplacer votre rendez-vous
            </button>
          </div>

          {userData.body.meeting.typeMeeting.type === "unique" && (
            <>
              <p className={styles.myMeeting__meeting__detail__content__p}>
                {" "}
                Si vous supprimer ce rendez-vous unique le paiement que vous
                avez effectué ne sera pas validé et aucun argent ne sera débité
                de votre compte.
              </p>
              <div
                className={styles.myMeeting__meeting__detail__content__submit}
              >
                <button
                  className={`${styles.myMeeting__meeting__detail__content__submit__btn} ${styles.myMeeting__meeting__detail__content__submit__btn__delete}`}
                  onClick={() => {
                    dispatch({
                      type: "ModalDeleteMeeting/open",
                    });
                  }}
                >
                  Supprimer votre rendez-vous unique
                </button>
              </div>
            </>
          )}
          {userData.body.meeting.typeMeeting.type !== "unique" && (
            <>
              <p className={styles.myMeeting__meeting__detail__content__p}>
                Vous disposez d&apos;une offre{" "}
                <strong>{userData.body.meeting.typeMeeting.type}</strong> avec
                plusieurs rendez-vous. Si vous décidez d&apos;annuler
                l&apos;offre, vous serez remboursé de la somme restante.
              </p>
              <p className={styles.myMeeting__meeting__detail__content__p}>
                Vous serez remboursé ici de{" "}
                {userData.body.meeting.typeMeeting.number * 100} euros.
              </p>
              <div
                className={styles.myMeeting__meeting__detail__content__submit}
              >
                <button
                  className={`${styles.myMeeting__meeting__detail__content__submit__btn} ${styles.myMeeting__meeting__detail__content__submit__btn__delete}`}
                  onClick={() => {
                    dispatch({
                      type: "ModalDeleteMeeting/open",
                    });
                  }}
                >
                  Annuler l&apos;offre en cours
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyMeeting;
