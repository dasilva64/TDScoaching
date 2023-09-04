import { AppDispatch } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./DisplayDiscoveryMeeting.module.scss";
import DatePickerEditDesktop from "../dataPickerEdit/DatePickerEditDesktop";

const DisplayDiscoveryMeeting = ({ meetings, meeting, discovery }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [displayEdit, setDisplayEdit] = React.useState<boolean>(false);

  const { push } = useRouter();
  let restDate;
  if (meeting && meeting.limitDate) {
    let limitDate = meeting.limitDate;
    let convertInDate = new Date(Number(limitDate));
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());
    restDate = new Date(difference);
  }
  let content;
  if (meeting && meeting.status === true) {
    content = (
      <>
        {displayEdit && (
          <DatePickerEditDesktop events={meetings} discovery={discovery} />
        )}
        <div
          className={`${
            displayEdit === true
              ? styles.myFirstMeeting__meeting__flexwidth
              : styles.myFirstMeeting__meeting__fullwidth
          }`}
        >
          <div className={styles.myFirstMeeting__meeting__détail}>
            <h3 className={styles.myFirstMeeting__meeting__détail__h3}>
              Voici votre prochain rendez-vous :{" "}
            </h3>
            <p className={styles.myFirstMeeting__meeting__détail__p}>
              <strong>Date</strong> :{" "}
              {new Date(meeting.startAt).toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className={styles.myFirstMeeting__meeting__détail__p}>
              <strong>Heure</strong> :{" "}
              {new Date(meeting.startAt).toLocaleTimeString("fr-FR")}
            </p>
            <p className={styles.myFirstMeeting__meeting__détail__p}>
              <strong>Type de rendez-vous</strong> : {meeting.typeMeeting.type}
            </p>
            <p className={styles.myFirstMeeting__meeting__détail__p}>
              <strong>Type de coaching</strong> : {meeting.typeMeeting.coaching}
            </p>
            <div
              className={`${styles.myFirstMeeting__meeting__détail__div} ${
                displayEdit === true
                  ? styles.myFirstMeeting__meeting__détail__div__block
                  : styles.myFirstMeeting__meeting__détail__div__flex
              }`}
            >
              {displayEdit === true && (
                <button
                  className={`${styles.myFirstMeeting__meeting__détail__div__btn} ${styles.myFirstMeeting__meeting__détail__div__btn__edit}`}
                  onClick={() => {
                    setDisplayEdit(false);
                  }}
                >
                  Fermer le calendrier
                </button>
              )}
              {displayEdit === false && (
                <button
                  className={`${styles.myFirstMeeting__meeting__détail__div__btn} ${styles.myFirstMeeting__meeting__détail__div__btn__edit}`}
                  onClick={() => {
                    setDisplayEdit(true);
                  }}
                >
                  Modifier votre rendez-vous
                </button>
              )}

              <button
                className={`${styles.myFirstMeeting__meeting__détail__div__btn} ${styles.myFirstMeeting__meeting__détail__div__btn__delete}`}
                onClick={() => {
                  dispatch({
                    type: "form/openModalDeleteFirstMeeting",
                  });
                }}
              >
                Supprimer ce rendez-vous
              </button>
            </div>
          </div>
          <div className={styles.myFirstMeeting__meeting__détail}>
            <h3 className={styles.myFirstMeeting__meeting__détail__h3}>
              visioconférence :{" "}
            </h3>
            <p className={styles.myFirstMeeting__meeting__détail__p}>
              Ce rendez-vous se fait par visioconférence. Vous recevrez un mail
              avec le lien de connexion 24h avant le rendez-vous.
            </p>
            <p className={styles.myFirstMeeting__meeting__détail__p}>
              Si vous rencontrer un problème avec le lien de connexion veuillez
              me contacter par{" "}
              <a
                className={styles.myFirstMeeting__meeting__détail__a}
                href="mailto:contact@tds-coachingdevie.fr"
              >
                email
              </a>{" "}
              ou par{" "}
              <a
                className={styles.myFirstMeeting__meeting__détail__a}
                href="tel:+33781673125"
              >
                téléphone
              </a>
            </p>
          </div>
        </div>
      </>
    );
  } else if (!meeting && !discovery) {
    content = (
      <>
        <div className={styles.myFirstMeeting__about}>
          <h3 className={styles.myFirstMeeting__about__h3}>
            Vous n&apos;avez pas encore de rendez-vous de programmé
          </h3>
          <div className={styles.myFirstMeeting__about__container}>
            <div className={styles.myFirstMeeting__about__container__discovery}>
              <h3
                className={
                  styles.myFirstMeeting__about__container__discovery__h3
                }
              >
                Rendez-vous découverte
              </h3>
              <p
                className={
                  styles.myFirstMeeting__about__container__discovery__p
                }
              >
                Ce rendez-vous est gratuit et sans engagement. Il permet de
                faire connaissance et de définir ensemble vos objectifs et vos
                besoins. Vous pouvez sélectionner une date en cliquant sur le
                calendrier.
              </p>
              <div
                className={
                  styles.myFirstMeeting__about__container__discovery__div
                }
              >
                <Image
                  className={
                    styles.myFirstMeeting__about__container__discovery__div__img
                  }
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/clock-solid.svg"}
                  alt="bousole"
                />
                <p
                  className={
                    styles.myFirstMeeting__about__container__discovery__div__p
                  }
                >
                  : 30 min
                </p>
              </div>
              <div
                className={
                  styles.myFirstMeeting__about__container__discovery__div
                }
              >
                <Image
                  className={
                    styles.myFirstMeeting__about__container__discovery__div__img
                  }
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/euro-sign-solid.svg"}
                  alt="bousole"
                />
                <p
                  className={
                    styles.myFirstMeeting__about__container__discovery__div__p
                  }
                >
                  : Gratuit
                </p>
              </div>
            </div>
            <div className={styles.myFirstMeeting__about__container__contact}>
              <p
                className={styles.myFirstMeeting__about__container__contact__p}
              >
                Vous pouvez m&apos;envoyer un mail en cliquant sur le bouton
                ce-dessous si vous voulez avoir d&apos;avantage de renseignement
                ou pour prendre un rendez-vous personnalisé.
              </p>
              <div
                className={
                  styles.myFirstMeeting__about__container__contact__div
                }
              >
                <button
                  className={
                    styles.myFirstMeeting__about__container__contact__div__btn
                  }
                  onClick={() => {
                    push("/contact");
                  }}
                >
                  Me contacter
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{content}</>;
};

export default DisplayDiscoveryMeeting;
