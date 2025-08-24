import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import FullCalendar from "@fullcalendar/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "@/app/components/image/Image";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import timeGridPlugin from "@fullcalendar/timegrid";
import styles from "./ModalCalendarEditMeetingUnique.module.scss"
import { useDispatch, useSelector } from "react-redux";

const ModalCalendarEditMeetingUnique = ({ allData, startMeet }: any) => {
  const [isMobile, setIsMobile] = useState<null | boolean>(null);

  const dispatch = useDispatch<AppDispatch>();
  const closeModal = () => {
    dispatch({ type: "ModalCalendarEditMeetingRendezVous/close" });
  };
  const { displayModalCalendarEditMeetingRendezVous } = useSelector(
    (state: RootState) => state.ModalCalendarEditMeetingRendezVous
  );
  const [meetingDate, setMeetingDate] = useState<any>(null);
  const handleDateClick = (dateCalendar: any) => {
    if (allData.length > 0) {
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
            type: "ModalEditMeetingRendezVous/open",
            payload: { date: dateCalendar },
          });
          dispatch({ type: "ModalCalendarEditMeetingRendezVous/close" });
        }
      }
    } else {
      dispatch({
        type: "flash/clearFlashMessage",
      });
      dispatch({
        type: "ModalEditMeetingRendezVous/open",
        payload: { date: dateCalendar },
      });
      dispatch({ type: "ModalCalendarEditMeetingRendezVous/close" });
    }
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
  const calendarRef: any = useRef(null);
  return (
    <>
      <TabIndex displayModal={displayModalCalendarEditMeetingRendezVous} />
      <AnimatePresence>
        {displayModalCalendarEditMeetingRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalCalendarEditMeetingUnique}
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
                className={styles.modalCalendarEditMeetingUnique__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalCalendarEditMeetingUnique__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalCalendarEditMeetingUnique__h1}`}>
                Modification du rendez-vous unique
              </h2>
              <p className={styles.modalCalendarEditMeetingUnique__p}>Selectionnez une date pour modifier votre rendez-vous</p>
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
                    events={allData}
                    weekends={false}
                    slotMinTime={"09:00:00"}
                    slotMaxTime={"18:00:00"}
                    allDaySlot={false}

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
                    }} */
                    /* visibleRange={(nowDate) => {
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
                        text: "Aujourd'hui",
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
                    events={allData}
                    weekends={false}
                    slotMinTime={"09:00:00"}
                    slotMaxTime={"18:00:00"}
                    allDaySlot={false}
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
}

export default ModalCalendarEditMeetingUnique