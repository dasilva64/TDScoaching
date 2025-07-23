import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store/store";
import FullCalendar from "@fullcalendar/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "@/app/components/image/Image";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import styles from "./ModalCalendarDiscoveryMeeting.module.scss";
import useGet from "@/app/components/hook/useGet";
import Load from "./load/Load";

const ModalCalendarDiscoveryMeeting = () => {
  const [allData, setAllData] = useState<any[] | null>(null);
  const [error, setError] = useState<number>(0);
  const [dateStr, setDateStr] = useState<any>("")
  const dispatch = useDispatch();
  const { displayModalCalendarDiscoveryMeetingHeader } = useSelector(
    (state: RootState) => state.ModalCalendarDiscoveryMeetingHeader
  );
  const {
    data: userData,
    isLoading,
  } = useGet(displayModalCalendarDiscoveryMeetingHeader ? "/components/header/modal/discovery/api/ModalCalendarDiscoveryMeeting" : null);

  useEffect(() => {
    if (userData) {
      if (userData.status === 200) {
        let array = [];

        for (let i = 0; i < userData.body.meetings.length; i++) {
          array.push({
            start: userData.body.meetings[i].startAt,
            editable: false,
            backgroundColor: "red",
            textColor: "red",
          });
        }
        setAllData(array);
      } else {
        dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: userData.message },
          });
      }
    }
  }, [isLoading, userData, dispatch]);

  const calendarRef: any = useRef(null);

  const [isMobile, setIsMobile] = useState<null | boolean>(null);

  const closeModal = () => {
    dispatch({
      type: "ModalCalendarDiscoveryMeetingHeader/close",
    });
  };
  

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
        type: "ModalAddDiscoveryMeetingHeader/open",
        payload: { date: dateStr },
      });
      dispatch({ type: "ModalCalendarDiscoveryMeetingHeader/close" });
    }
    }
    
  }, [error, dateStr, dispatch])
  const handleDateClick = (arg: any) => {
    setError(0)
    setDateStr(arg.dateStr)
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
          setError(prev => prev + 1)
        }
      }
    } else {
      dispatch({
        type: "flash/clearFlashMessage",
      });
      dispatch({
        type: "ModalAddDiscoveryMeetingHeader/open",
        payload: { date: arg.dateStr },
      });
      dispatch({ type: "ModalCalendarDiscoveryMeetingHeader/close" });
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
  return (
    <>
      <TabIndex displayModal={displayModalCalendarDiscoveryMeetingHeader} />
      <AnimatePresence>
        {displayModalCalendarDiscoveryMeetingHeader === true && (
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
              {isLoading && (
                <>
                <Load />
                </>
              )}
              {!isLoading && (
                <>
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
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalCalendarDiscoveryMeeting;
