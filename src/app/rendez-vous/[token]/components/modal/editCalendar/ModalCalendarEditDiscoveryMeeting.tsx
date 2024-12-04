import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ModalCalendarEditDiscoveryMeeting.module.scss";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import useGet from "@/app/components/hook/useGet";

const ModalCalendarEditDiscoveryMeeting = ({ token, allMeeting }: any) => {
  const [meetingDate, setMeetingDate] = useState<any>(null);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState<null | boolean>(null);
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
  const closeModal = () => {
    dispatch({
      type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/close",
    });
  };
  const calendarRef: any = useRef(null);
  const { displayModalCalendarEditDiscoveryMeetingRendezVousToken } =
    useSelector(
      (state: RootState) =>
        state.ModalCalendarEditDiscoveryMeetingRendezVousToken
    );
  const handleDateClick = (arg: any) => {
    if (allMeeting.length > 0) {
      for (let i = 0; i < allMeeting.length; i++) {
        var date = new Date(allMeeting[i].start);
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
            type: "ModalEditDiscoveryMeetingRendezVousToken/open",
            payload: { date: arg.dateStr },
          });
          dispatch({
            type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/close",
          });
        }
      }
    } else {
      dispatch({
        type: "flash/clearFlashMessage",
      });
      dispatch({
        type: "ModalAddDiscovery/open",
        payload: { date: arg.dateStr },
      });
      dispatch({ type: "ModalCalendarDiscovery/close" });
    }
  };
  return (
    <>
      <TabIndex
        displayModal={displayModalCalendarEditDiscoveryMeetingRendezVousToken}
      />
      <AnimatePresence>
        {displayModalCalendarEditDiscoveryMeetingRendezVousToken === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalCalendarEditDiscovery}
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
                className={styles.modalCalendarEditDiscovery__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalCalendarEditDiscovery__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalCalendarEditDiscovery__h1}`}>
                Rendez-vous de découverte test
              </h2>
              <p>Selectionnez une date pour modifier votre rendez-vous</p>
              {isMobile === false && (
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
                        text: "Mon rendez-vous",
                        click: function () {
                          if (calendarRef.current === null) return;
                          const calendarApi = calendarRef.current.getApi();
                          calendarApi.gotoDate(meetingDate);
                        },
                      },
                    }}
                    headerToolbar={{
                      left: "title",
                      center: "",
                      right: "myCustomButton prev next",
                    }}
                    events={allMeeting}
                    weekends={false}
                    slotMinTime={"09:00:00"}
                    slotMaxTime={"18:00:00"}
                    allDaySlot={false}
                    selectable={false}
                    editable={false}
                    droppable={false}
                    eventStartEditable={false}
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
              {isMobile === true && (
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
                    events={allMeeting}
                    weekends={false}
                    slotMinTime={"09:00:00"}
                    slotMaxTime={"18:00:00"}
                    allDaySlot={false}
                    editable={false}
                    selectable={false}
                    height={"auto"}
                    dateClick={(e) => {
                      /* handleDateClick(e); */
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

export default ModalCalendarEditDiscoveryMeeting;
