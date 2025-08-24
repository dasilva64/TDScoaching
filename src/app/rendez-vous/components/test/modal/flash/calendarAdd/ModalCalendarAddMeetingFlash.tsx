import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import FullCalendar from "@fullcalendar/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "@/app/components/image/Image";
import styles from "./ModalCalendarAddMeetingFlash.module.scss"
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import timeGridPlugin from "@fullcalendar/timegrid";

const ModalCalendarAddMeetingFlash = ({
    allData,
    type
}: {
    allData: any;
    type: any
}) => {
    const [isMobile, setIsMobile] = useState<null | boolean>(null);
    const dispatch = useDispatch<AppDispatch>();
    const closeModal = () => {
        dispatch({ type: "ModalCalendarAddMeetingRendezVous/close" });
    };
    const { displayModalCalendarAddMeetingRendezVous } = useSelector(
        (state: RootState) => state.ModalCalendarAddMeetingRendezVous
    );
    const handleDateClick = (arg: any) => {
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
                        type: "ModalAddMeetingRendezVous/open",
                        payload: { date: arg.dateStr },
                    });

                    dispatch({ type: "ModalCalendarAddMeetingRendezVous/close" });
                }
            }
        } else {
            dispatch({
                type: "flash/clearFlashMessage",
            });
            dispatch({
                type: "ModalAddMeetingRendezVous/open",
                payload: { date: arg.dateStr },
            });


            dispatch({ type: "ModalCalendarAddMeetingRendezVous/close" });
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
            <TabIndex displayModal={displayModalCalendarAddMeetingRendezVous} />
            <AnimatePresence>
                {displayModalCalendarAddMeetingRendezVous === true && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ opacity: 0 }}
                            className={styles.bg}
                            onClick={() => closeModal()}
                        />
                        <motion.div
                            className={styles.modalCalendarAddMeetingFlash}
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
                                className={styles.modalCalendarAddMeetingFlash__btn}
                                onClick={() => closeModal()}
                            >
                                <Image
                                    className={styles.modalCalendarAddMeetingFlash__btn__img}
                                    src="/assets/icone/xmark-solid.svg"
                                    alt="icone fermer modal"
                                    width={30}
                                    height={30}
                                ></Image>
                            </button>
                            <h2 className={`${styles.modalCalendarAddMeetingFlash__h1}`}>
                                Rendez-vous {type}
                            </h2>
                            <p className={styles.modalCalendarAddMeetingFlash__p}>
                                Selectionnez une date pour votre prochain rendez-vous
                            </p>
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
                                                text: "Aujourd'hui",
                                                click: function () {
                                                    if (calendarRef.current === null) return;
                                                    const calendarApi = calendarRef.current.getApi();
                                                    let currentDate = new Date();
                                                    calendarApi.gotoDate(
                                                        new Date(Date.now() + 36 * 60 * 60 * 1000)
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
                                                        new Date(Date.now() + 36 * 60 * 60 * 1000)
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
}
export default ModalCalendarAddMeetingFlash