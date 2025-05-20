/* import React, { useEffect } from "react";
import styles from "./MyDiscovery.module.scss";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import fetchGet from "@/app/components/fetch/fetchGet";
import { useRouter } from "next/navigation";
import ModalEditDiscovery from "./modal/ModalEditDiscovery";
import ModalCalendarEditDiscovery from "./modal/ModalCalendarEditDiscovery";

const MyDiscovery = ({ meeting, link }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  let current = new Date();
  current.setHours(current.getHours() + 24);
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/discovery/my/api/?query=" + meeting.userId,
    fetchGet
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      }
    }
  }, [data, dispatch, reset, router]);
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
            Découverte
          </p>
          <p className={styles.test__card__p}>
            <Image
              className={styles.test__card__p__img}
              src="/assets/icone/coach.png"
              alt="clock"
              width={20}
              height={20}
            />
            Famillial
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
          <div className={styles.test__card__action}>
            <button
              className={`${styles.test__card__action__btn} ${styles.myDiscovery__detail__content__submit__btn__edit}`}
              onClick={() => {
                dispatch({
                  type: "ModalCalendarEditMeetingRendezVous/open",
                });
              }}
            >
              Déplacer mon rendez-vous
            </button>
            <button
              className={`${styles.test__card__action__btn} ${styles.myDiscovery__detail__content__submit__btn__delete}`}
              onClick={() => {
                dispatch({
                  type: "ModalDeleteMeetingRendezVous/open",
                });
              }}
            >
              Supprimer mon rendez-vous
            </button>
          </div>
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

       <div className={styles.myDiscovery}> 
       <div className={styles.myDiscovery__test}>
          <div className={styles.myDiscovery__test__next}>
            <Image
              className={styles.myDiscovery__test__next__img}
              src="/assets/icone/circle-exclamation-solid-black.svg"
              alt=""
              width={20}
              height={20}
            />
            <p>Vous avez un rendez-vous de découverte en attente</p>
          </div>
        </div> 
       <div className={styles.myDiscovery__test}>
          <div className={styles.myDiscovery__detail__div}>
            <div className={styles.myDiscovery__detail__div__div}>
              <p className={styles.myDiscovery__detail__p}>
                <Image
                  className={styles.myDiscovery__detail__p__img}
                  src="/assets/icone/calendar-regular.svg"
                  alt="clock"
                  width={25}
                  height={25}
                />
                {" : "}
                {new Date(meeting.startAt).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className={styles.myDiscovery__detail__p}>
                <Image
                  className={styles.myDiscovery__detail__p__img}
                  src="/assets/icone/clock-solid.svg"
                  alt="clock"
                  width={25}
                  height={25}
                />
                {" : "}
                {new Date(meeting.startAt).toLocaleTimeString("fr-FR")}
              </p>
              <p className={styles.myDiscovery__detail__p}>
                <Image
                  className={styles.myDiscovery__detail__p__img}
                  src="/assets/icone/coach.png"
                  alt="clock"
                  width={25}
                  height={25}
                />
                {" : "}
                {meeting.type}
              </p>
            </div>
          </div>
          {current.toISOString() < meeting.startAt && (
            <>
              <div className={`${styles.myDiscovery__detail__content}`}>
                <div className={styles.myDiscovery__detail__content__submit}>
                  <button
                    className={`${styles.myDiscovery__detail__content__submit__btn} ${styles.myDiscovery__detail__content__submit__btn__edit}`}
                    onClick={() => {
                      dispatch({
                        type: "ModalCalendarEditMeetingRendezVous/open",
                      });
                    }}
                  >
                    Déplacer mon rendez-vous de découverte
                  </button>
                </div>
                <div className={styles.myDiscovery__detail__content__submit}>
                  <button
                    className={`${styles.myDiscovery__detail__content__submit__btn} ${styles.myDiscovery__detail__content__submit__btn__edit}`}
                    onClick={() => {
                      dispatch({
                        type: "ModalEditTypeDiscovery/open",
                      });
                    }}
                  >
                    Modifier le type de coaching
                  </button>
                </div>
                <div className={styles.myDiscovery__detail__content__submit}>
                  <button
                    className={`${styles.myDiscovery__detail__content__submit__btn} ${styles.myDiscovery__detail__content__submit__btn__delete}`}
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
              <p className={`${styles.myDiscovery__detail__content__action}`}>
                Vous ne pouvez pas effectué ces actions si le rendez-vous est
                dans moins de 24h
              </p>
            </>
          )}
          {current.toISOString() > meeting.startAt && (
            <div className={`${styles.myDiscovery__detail__content__test}`}>
              <p>
                Le rendez vous se déroule dans moins de 24h, vous ne pouvez donc
                pas le modifier ou le supprimer.
              </p>
              <p style={{ margin: "10px 0px" }}>
                Vous pouvez tout de même m&apos;envoyer un mail si vous
                souhaitez le supprimer.
              </p>
              <div className={styles.myDiscovery__detail__content__test__div}>
                <button
                  className={`${styles.myDiscovery__detail__content__test__div__btn} ${styles.myFirstMeeting__meeting__detail__content__submit__btn__edit}`}
                  onClick={() => {
                    trigger();
                    
                  }}
                >
                  Envoyer une demander de suppression
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.myDiscovery__test2}>
          <div className={styles.myDiscovery__test2__next}>
            <Image
              className={styles.myDiscovery__test__next__img}
              src="/assets/icone/video-solid.svg"
              alt=""
              width={20}
              height={20}
            />
            {link === null && (
              <p className={styles.myDiscovery__visio__p}>
                Ce rendez-vous se fait par visioconférence. Vous recevrez un
                mail avec le lien de connexion 24h avant le rendez-vous.
              </p>
            )}
            {link !== null && (
              <>
                <Link
                  className={styles.myDiscovery__visio__link}
                  href={`${link}`}
                  target={"_blank"}
                >
                  Lien vers le rendez-vous
                </Link>
              </>
            )}
          </div>
          <p className={styles.myDiscovery__visio__problem}>
            Si vous rencontrer un problème avec le lien de connexion veuillez me
            contacter par :
            <ul className={styles.myDiscovery__visio__ul}>
              <li className={styles.myDiscovery__visio__ul__li}>
                Mail :{" "}
                <a
                  className={styles.myDiscovery__visio__a}
                  href="mailto:contact@tds-coachingdevie.fr"
                >
                  contact@tds-coachingdevie.fr
                </a>
              </li>
              <li className={styles.myDiscovery__visio__ul__li}>
                Téléphone :{" "}
                <a
                  className={styles.myDiscovery__visio__a}
                  href="tel:+33781673125"
                >
                  0781673125
                </a>
              </li>
            </ul>
          </p>
        </div> 
       <div className={`${styles.myDiscovery__visio}`}>
          <h2 className={styles.myDiscovery__visio__h2}>Visioconférence : </h2>
          {link === null && (
            <>
              <p className={styles.myDiscovery__visio__p}>
                Ce rendez-vous se fait par visioconférence. Vous recevrez un
                mail avec le lien de connexion 24h avant le rendez-vous.
              </p>
              <p className={styles.myDiscovery__visio__p}>
                Si vous rencontrer un problème avec le lien de connexion
                veuillez me contacter par{" "}
                <a
                  className={styles.myDiscovery__visio__a}
                  href="mailto:contact@tds-coachingdevie.fr"
                >
                  email
                </a>{" "}
                ou par{" "}
                <a
                  className={styles.myDiscovery__visio__a}
                  href="tel:+33781673125"
                >
                  téléphone
                </a>
              </p>
            </>
          )}
          {link !== null && (
            <>
              <Link href={`${link}`}>Lien vers le rendez-vous</Link>
            </>
          )}
        </div> 
       </div> 
    </>
  );
};

export default MyDiscovery;
 */