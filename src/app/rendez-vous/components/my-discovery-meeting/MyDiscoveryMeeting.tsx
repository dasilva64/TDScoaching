import React from "react";
import styles from "./MyDiscoveryMeeting.module.scss";
import useGet from "@/app/components/hook/useGet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import Image from "next/image";

const MyDiscoveryMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserMeeting");
  return (
    <>
      <div className={styles.myFirstMeeting__meeting__detail}>
        <h2 className={styles.myFirstMeeting__meeting__detail__h2}>
          Voici votre prochain rendez-vous de découverte :{" "}
        </h2>
        <div className={styles.myFirstMeeting__meeting__detail__div}>
          <p className={styles.myFirstMeeting__meeting__detail__p}>
            <Image
              className={styles.myFirstMeeting__meeting__detail__p__img}
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
          <p className={styles.myFirstMeeting__meeting__detail__p}>
            <Image
              className={styles.myFirstMeeting__meeting__detail__p__img}
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
          <p className={styles.myFirstMeeting__meeting__detail__p}>
            <Image
              className={styles.myFirstMeeting__meeting__detail__p__img}
              src="/assets/icone/coach.png"
              alt="clock"
              width={25}
              height={25}
            />
            {" : "}
            {userData.body.meeting.typeMeeting.coaching}
          </p>
        </div>
        <div className={`${styles.myFirstMeeting__meeting__detail__content}`}>
          <div
            className={styles.myFirstMeeting__meeting__detail__content__submit}
          >
            <button
              className={`${styles.myFirstMeeting__meeting__detail__content__submit__btn} ${styles.myMeeting__meeting__detail__content__submit__btn__edit}`}
              onClick={() => {
                dispatch({
                  type: "ModalDatePickerEditDiscovery/open",
                });
              }}
            >
              Déplacer votre rendez-vous
            </button>
          </div>
          <div
            className={styles.myFirstMeeting__meeting__detail__content__submit}
          >
            <button
              className={`${styles.myFirstMeeting__meeting__detail__content__submit__btn} ${styles.myMeeting__meeting__detail__content__submit__btn__edit}`}
              onClick={() => {
                dispatch({
                  type: "ModalDeleteDiscoveryMeeting/open",
                });
              }}
            >
              Supprimer mon rendez-vous de découverte
            </button>
          </div>
        </div>
      </div>
      <div className={`${styles.myFirstMeeting__meeting__visio}`}>
        <h2 className={styles.myFirstMeeting__meeting__visio__h2}>
          visioconférence :{" "}
        </h2>
        <p className={styles.myFirstMeeting__meeting__visio__p}>
          Ce rendez-vous se fait par visioconférence. Vous recevrez un mail avec
          le lien de connexion 24h avant le rendez-vous.
        </p>
        <p className={styles.myFirstMeeting__meeting__visio__p}>
          Si vous rencontrer un problème avec le lien de connexion veuillez me
          contacter par{" "}
          <a
            className={styles.myFirstMeeting__meeting__visio__a}
            href="mailto:contact@tds-coachingdevie.fr"
          >
            email
          </a>{" "}
          ou par{" "}
          <a
            className={styles.myFirstMeeting__meeting__visio__a}
            href="tel:+33781673125"
          >
            téléphone
          </a>
        </p>
      </div>
    </>
  );
};

export default MyDiscoveryMeeting;
