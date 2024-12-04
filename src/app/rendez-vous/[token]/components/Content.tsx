"use client";

import React, { useEffect, useState } from "react";
import styles from "./Content.module.scss";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import fetchGet from "@/app/components/fetch/fetchGet";
import useGetOneByToken from "@/app/components/hook/meeting/useGetOneByToken";
import { useDispatch } from "react-redux";
import ModalCalendarEditDiscoveryMeeting from "./modal/editCalendar/ModalCalendarEditDiscoveryMeeting";
import ModalDeleteDiscoveryMeeting from "./modal/delete/ModalDeleteDiscoveryMeeting";
import ModalComfirmDiscoveryMeeting from "./modal/confirm/ModalComfirmDiscoveryMeeting";
import { AppDispatch } from "@/app/redux/store";
import ModalEditDiscoveryMeeting from "./modal/edit/ModalEditDiscoveryMeeting";

const Content = () => {
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, mutate } = useGetOneByToken(token[2]);
  const [allData, setAllData] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        let array = [];
        for (let i = 0; i < data.body.allMeeting.length; i++) {
          if (data.body.meet.userMail === data.body.allMeeting[i].userMail) {
            array.push({
              start: data.body.allMeeting[i].startAt,
              editable: false,
              backgroundColor: "green",
              textColor: "white",
              title: "Mon rendez-vous",
            });
          } else {
            array.push({
              start: data.body.allMeeting[i].startAt,
              editable: false,
              backgroundColor: "red",
              textColor: "red",
            });
          }
        }
        setAllData(array);
      }
    }
  }, [data]);
  return (
    <>
      {data && (
        <>
          {data.body && (
            <>
              <ModalCalendarEditDiscoveryMeeting
                token={token[2]}
                allMeeting={allData}
              />
              <ModalDeleteDiscoveryMeeting token={token[2]} />
              <ModalComfirmDiscoveryMeeting token={token[2]} mutate={mutate} />
              <ModalEditDiscoveryMeeting mutate={mutate} token={token[2]} />
              <div className={styles.content}>
                <div className={styles.content__meet}>
                  <p className={styles.content__meet__p}>
                    <Image
                      className={styles.content__meet__p__img}
                      src="/assets/icone/calendar-regular.svg"
                      alt="clock"
                      width={25}
                      height={25}
                    />
                    {" : "}
                    {new Date(data.body.meet.startAt).toLocaleDateString(
                      "fr-FR",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className={styles.content__meet__p}>
                    <Image
                      className={styles.content__meet__p__img}
                      src="/assets/icone/clock-solid.svg"
                      alt="clock"
                      width={25}
                      height={25}
                    />
                    {" : "}
                    {new Date(data.body.meet.startAt).toLocaleTimeString(
                      "fr-FR"
                    )}
                  </p>
                  <p className={styles.content__meet__p}>
                    <Image
                      className={styles.content__meet__p__img}
                      src="/assets/icone/coach.png"
                      alt="clock"
                      width={25}
                      height={25}
                    />
                    {" : "}
                    {data.body.meet.type}
                  </p>
                </div>
                {data.body.meet.confirm === false && (
                  <>
                    <p>
                      Attention ce rendez-vous n'est pas encore confirmé,
                      veuillez le confimer 24h avant la date du rendez-vous
                      sinon il sera automatiquement supprimé.
                    </p>
                    <div className={styles.content__action}>
                      <button
                        className={styles.content__action__btn}
                        onClick={() => {
                          dispatch({
                            type: "ModalConfirmDiscoveryMeetingRendezVousToken/open",
                          });
                        }}
                      >
                        Comfirmer le rendez-vous
                      </button>
                    </div>
                  </>
                )}
                {data.body.meet.confirm === true && (
                  <>
                    <p>Votre rendez-vous est bien confirmé</p>
                  </>
                )}
                <div className={styles.content__action}>
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
                    className={styles.content__action__btn}
                    onClick={() => {
                      dispatch({
                        type: "ModalDeleteDiscoveryMeetingRendezVousToken/open",
                      });
                    }}
                  >
                    Supprimer le rendez-vous
                  </button>
                </div>
                <p>
                  Si le rendez n'est pas comfirmer 24h avant alors il sera
                  automatiquement supprimer.
                </p>
                <p>
                  Vous ne pouvez modifier ou supprimer le rendez-vous 24h avant
                  le date du rendez-vous.
                </p>
              </div>
            </>
          )}
        </>
      )}
      {isLoading && (
        <>
          <div className={`${styles.content} ${styles.content__load}`}></div>
        </>
      )}
    </>
  );
};

export default Content;
