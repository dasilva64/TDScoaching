import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "@/app/components/image/Image";
import styles from "./ModalCalendarEditDiscoveryMeeting.module.scss";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";

const ModalCalendarEditDiscoveryMeeting = ({ token, allMeeting, startMeet }: any) => {
  const [meetingDate, setMeetingDate] = useState<any>(null);
  const dispatch = useDispatch();
  const [error, setError] = useState<number>(0);
  const [dateStr, setDateStr] = useState<any>("")
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

    useEffect(() => {
      if (dateStr) {
  
        if (error > 0) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage:
              "Ce rendez-vous est déjà prit, veuillez en selectionner un autre",
          },
        });
      } else  {
        dispatch({
          type: "flash/clearFlashMessage",
        });
        dispatch({
          type: "ModalEditDiscoveryMeetingRendezVousToken/open",
          payload: { date: dateStr },
        });
        dispatch({ type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/close" });
      }
      }
      
    }, [error, dateStr, dispatch])
  const handleDateClick = (dateCalendar: any) => {
    setError(0)
    setDateStr(dateCalendar)
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

        var date2 = new Date(dateCalendar);
        var now_utc2 = Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes(),
          date.getUTCSeconds()
        );
        if (new Date(date).getTime() === new Date(date2).getTime()) {
          setError(prev => prev + 1)
        }
        
        
      }
    } else {
        dispatch({
          type: "flash/clearFlashMessage",
        });
        dispatch({
          type: "ModalEditDiscoveryMeetingRendezVousToken/open",
          payload: { date: dateCalendar },
        });
        dispatch({
          type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/close",
        });
      
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
                  initialDate={startMeet}
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
                          calendarApi.gotoDate(startMeet);
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
                      const now = new Date();
                      const minDate = new Date(now.getTime() + 36 * 60 * 60 * 1000);
                      if (e.date < minDate) {
                        alert("Impossible de créer un événement avant 36h.");
                      } else {
                        handleDateClick(e.dateStr);
                      }
                    }}
                    eventAllow={(dropInfo, draggedEvent) => {
                      const now = new Date();
                      const minDate = new Date(now.getTime() + 36 * 60 * 60 * 1000);
                      return dropInfo.start >= minDate;
                    }}
                  eventDrop={(e) => {
                    handleDateClick(e.event.start);
                  }}
                    /* validRange={(nowDate) => {
                      var startDate = new Date(nowDate.valueOf());
                      startDate.setTime(startDate.getTime() + 36 * 60 * 60 * 1000)
                      return {
                        start: startDate,
                      };
                    }}
                    visibleRange={(nowDate) => {
                      var startDate = new Date(nowDate.valueOf());
                      startDate.setTime(startDate.getTime() + 36 * 60 * 60 * 1000)
                      return {
                        start: startDate,
                      };
                    }} */
                    slotDuration={"01:00:00"}
                  />
                </>
              )}
              {isMobile === true && (
                <>
                  <FullCalendar
                  initialDate={startMeet}
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
                        text: "Mon rendez-vous",
                        click: function () {
                          if (calendarRef.current === null) return;
                          const calendarApi = calendarRef.current.getApi();
                          calendarApi.gotoDate(startMeet);
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
                      const now = new Date();
                      const minDate = new Date(now.getTime() + 36 * 60 * 60 * 1000);
                      if (e.date < minDate) {
                        alert("Impossible de créer un événement avant 36h.");
                      } else {
                        handleDateClick(e.dateStr);
                      }
                    }}
                    eventAllow={(dropInfo, draggedEvent) => {
                      const now = new Date();
                      const minDate = new Date(now.getTime() + 36 * 60 * 60 * 1000);
                      return dropInfo.start >= minDate;
                    }}
                  eventDrop={(e) => {
                    handleDateClick(e.event.start);
                  }}
                    /* validRange={(nowDate) => {
                      var startDate = new Date(nowDate.valueOf());
                      startDate.setTime(startDate.getTime() + 36 * 60 * 60 * 1000)
                      return {
                        start: startDate,
                      };
                    }}
                    visibleRange={(nowDate) => {
                      var startDate = new Date(nowDate.valueOf());
                      startDate.setTime(startDate.getTime() + 36 * 60 * 60 * 1000)
                      return {
                        start: startDate,
                      };
                    }} */
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
