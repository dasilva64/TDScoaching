"use client";

import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import timeGridPlugin from "@fullcalendar/timegrid";
import styles from "./ModalCalendarDiscoveryMeeting.module.scss";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import useGet from "@/app/components/hook/useGet";

const ModalDiscoveryMeetingTest = () => {
  const [allData, setAllData] = useState<any[] | null>(null);

  const dispatch = useDispatch();
  /* const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/components/header/modal/discovery/api");
  if (isError) {
    dispatch({
      type: "flash/storeFlashMessage",
      payload: {
        type: "error",
        flashMessage: "Erreur lors du chargement, veuillez réessayer",
      },
    });
    dispatch({
      type: "ModalDiscoveryMeetingTest/close",
    });
  } */
  /* useEffect(() => {
    if (userData) {
      if (userData.status === 200) {
        let array = [];

        for (let i = 0; i < userData.body.meetings.length; i++) {
          if (userData.body.meeting === null) {
            array.push({
              start: userData.body.meetings[i].startAt,
              editable: true,
              backgroundColor: "red",
              textColor: "red",
              id: userData.body.meetings[i].userId,
            });
          } else {
            if (
              userData.body.meeting.userId === userData.body.meetings[i].userId
            ) {
              array.push({
                start: userData.body.meetings[i].startAt,
                editable: true,
                backgroundColor: "green",
                textColor: "white",
                title: "Mon rendez-vous",
                id: userData.body.meetings[i].userId,
              });
            } else {
              array.push({
                start: userData.body.meetings[i].startAt,
                editable: false,
                backgroundColor: "red",
                textColor: "red",
                id: userData.body.meetings[i].userId,
              });
            }
          }
        }
        setAllData(array);
      }
    }
  }, [userData]); */

  const calendarRef: any = useRef(null);

  const [isMobile, setIsMobile] = useState<null | boolean>(null);

  const closeModal = () => {
    dispatch({
      type: "ModalDiscoveryMeetingTest/close",
    });
  };
  const { displayModalDiscoveryMeetingTest } = useSelector(
    (state: RootState) => state.ModalDiscoveryMeetingTest
  );
  const handleDateClick = (arg: any) => {
    if (allData && allData.length > 0) {
      for (let i = 0; i < allData.length; i++) {
        var date = new Date(allData[i].start);
        var now_utc = Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes(),
          date.getUTCSeconds()
        );

        var date2 = new Date(arg.dateStr);
        var now_utc2 = Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes(),
          date.getUTCSeconds()
        );
        if (new Date(date).getTime() === new Date(date2).getTime()) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: {
              type: "error",
              flashMessage:
                "Ce rendez-vous est déjà prit, veuillez en selectionner un autre",
            },
          });
          break;
        } else {
          dispatch({
            type: "flash/clearFlashMessage",
          });
          dispatch({
            type: "ModalAddDiscoveryMeetingTest/open",
            payload: { date: arg.dateStr },
          });
          dispatch({ type: "ModalDiscoveryMeetingTest/close" });
        }
      }
    } else {
      dispatch({
        type: "flash/clearFlashMessage",
      });
      dispatch({
        type: "ModalAddDiscoveryMeetingTest/open",
        payload: { date: arg.dateStr },
      });
      dispatch({ type: "ModalDiscoveryMeetingTest/close" });
    }

    /* dispatch({
      type: "ModalAddDiscovery/open",
      payload: { date: arg.dateStr },
    });
    dispatch({ type: "ModalCalendarDiscovery/close" }); */
  };
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <TabIndex displayModal={displayModalDiscoveryMeetingTest} />
      <AnimatePresence>
        {displayModalDiscoveryMeetingTest === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modal}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: "-50%",
                x: "-50%",
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: 200,
                x: "-50%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <button
                type="button"
                className={styles.modal__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modal__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modal__h1}`}>
                Rendez-vous de découverte
              </h2>
              <div className={styles.modal__rappel}>
                <p className={styles.modal__rappel__p}>
                  <Image
                    className={styles.modal__rappel__p__img}
                    src="/assets/icone/clock-solid.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  45 min
                </p>
                <p className={styles.modal__rappel__p}>
                  <Image
                    className={styles.modal__rappel__p__img}
                    src="/assets/icone/dollar-sign-solid.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  Gratuit
                </p>
              </div>
              {isMobile === false && allData && (
                <>
                  <FullCalendar
                    ref={calendarRef}
                    locale={frLocale}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    businessHours={{
                      daysOfWeek: [1, 2, 3, 4, 5],
                      startTime: "09:00",
                      endTime: "18:00",
                    }}
                    customButtons={{
                      myCustomButton: {
                        text: "Aujourd'hui",
                        click: function () {
                          if (calendarRef.current === null) return;
                          const calendarApi = calendarRef.current.getApi();
                          let currentDate = new Date();
                          calendarApi.gotoDate(
                            currentDate.setDate(currentDate.getDate() + 2)
                          );
                        },
                      },
                    }}
                    headerToolbar={{
                      left: "title",
                      center: "",
                      right: "myCustomButton prev next",
                    }}
                    titleFormat={{
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }}
                    events={allData}
                    weekends={false}
                    slotMinTime={"09:00:00"}
                    slotMaxTime={"18:00:00"}
                    allDaySlot={false}
                    editable={true}
                    selectable={true}
                    height={"auto"}
                    dateClick={(e) => {
                      handleDateClick(e);
                    }}
                    validRange={(nowDate) => {
                      var startDate = new Date(nowDate.valueOf());
                      startDate.setDate(startDate.getDate() + 2);
                      return {
                        start: startDate,
                      };
                    }}
                    visibleRange={(nowDate) => {
                      var startDate = new Date(nowDate.valueOf());
                      startDate.setDate(startDate.getDate() + 2);
                      return {
                        start: startDate,
                      };
                    }}
                    slotDuration={"01:00:00"}
                  />
                </>
              )}
              {isMobile === true && allData && (
                <>
                  <FullCalendar
                    ref={calendarRef}
                    locale={frLocale}
                    plugins={[interactionPlugin, timeGridPlugin]}
                    initialView="timeGridDay"
                    businessHours={{
                      daysOfWeek: [1, 2, 3, 4, 5],
                      startTime: "09:00",
                      endTime: "18:00",
                    }}
                    customButtons={{
                      myCustomButton: {
                        text: "Aujourd'hui",
                        click: function () {
                          if (calendarRef.current === null) return;
                          const calendarApi = calendarRef.current.getApi();
                          let currentDate = new Date();
                          calendarApi.gotoDate(
                            currentDate.setDate(currentDate.getDate() + 2)
                          );
                        },
                      },
                    }}
                    headerToolbar={{
                      left: "title",
                      center: "",
                      right: "myCustomButton prev next",
                    }}
                    titleFormat={{
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }}
                    events={allData}
                    weekends={false}
                    slotMinTime={"09:00:00"}
                    slotMaxTime={"18:00:00"}
                    allDaySlot={false}
                    editable={true}
                    selectable={true}
                    height={"auto"}
                    dateClick={(e) => {
                      handleDateClick(e);
                    }}
                    validRange={(nowDate) => {
                      var startDate = new Date(nowDate.valueOf());
                      startDate.setDate(startDate.getDate() + 2);
                      return {
                        start: startDate,
                      };
                    }}
                    visibleRange={(nowDate) => {
                      var startDate = new Date(nowDate.valueOf());
                      startDate.setDate(startDate.getDate() + 2);
                      return {
                        start: startDate,
                      };
                    }}
                    slotDuration={"01:00:00"}
                  />
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalDiscoveryMeetingTest;
