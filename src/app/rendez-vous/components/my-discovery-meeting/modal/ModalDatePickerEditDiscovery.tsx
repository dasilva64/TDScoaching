"use client";

import React, { useEffect, useState } from "react";
import styles from "./ModalDatePickerEditDiscovery.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import useGet from "../../../../components/hook/useGet";

const ModalDatePickerEditDiscovery = () => {
  const {
    displayModalDatePickerEditDiscovery,
    reloadModalDatePickerEditDiscovery,
  } = useSelector((state: RootState) => state.ModalDatePickerEditDiscovery);
  const { id } = useSelector((state: RootState) => state.auth);
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserMeeting");
  const { isMobile } = useSelector((state: RootState) => state.Mobile);

  const [userClickSelectMonth, setUserClickSelectMonth] =
    useState<boolean>(false);
  const [userClickSelectYear, setUserClickSelectYear] =
    useState<boolean>(false);
  const [userClickSelectDay, setUserClickSelectDay] = useState<boolean>(false);
  const [arDay, setArDay] = useState<any>([null]);
  const dispatch = useDispatch<AppDispatch>();
  const [arDateWeek, setArDateWeek] = useState<any>([]);
  const [choiceDate, setChoiceDate] = useState<null | any>(null);
  const [startDateWeek, setStartDateWeek] = useState<string>("");
  const [arMeeting, setArMeeting] = useState<null | any>(null);
  const clearState = () => {
    setArDateWeek([]);
    setArMeeting(null);
    setStartDateWeek("");
    setChoiceDate(null);
    setArDay(null);
    setUserClickSelectDay(false);
    setUserClickSelectYear(false);
    setUserClickSelectMonth(false);
  };
  const yearar: any = {
    0: 2023,
    1: 2024,
    2: 2025,
    3: 2026,
    4: 2027,
  };
  const monthstext: any = {
    1: "Jan",
    2: "Fév",
    3: "Mar",
    4: "Avr",
    5: "Mai",
    6: "Jui",
    7: "Jui",
    8: "Aoû",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Déc",
  };

  const hourtext: any = {
    1: "8",
    2: "9",
    3: "10",
    4: "11",
    5: "12",
    6: "13",
    7: "14",
    8: "15",
    9: "16",
    10: "17",
    11: "18",
    12: "19",
    13: "20",
  };
  const daystext: any = {
    1: "Lundi",
    2: "Mardi",
    3: "Mercredi",
    4: "Jeudi",
    5: "vendredi",
  };
  useEffect(() => {
    if (reloadModalDatePickerEditDiscovery === true) {
      clearState();
      dispatch({
        type: "ModalDatePickerEditDiscovery/reload",
      });
    }
  }, [dispatch, reloadModalDatePickerEditDiscovery]);

  useEffect(() => {
    const getMeetingByWeek = (newar: any) => {
      let ar = [];

      let copyEvents = [...userData?.body.meetings];
      for (let y = 0; y < newar.length; y++) {
        let arWeek = [];
        for (let i = 0; i < copyEvents.length; i++) {
          let frDate = new Date(copyEvents[i]["startAt"]).toLocaleString(
            "fr-FR"
          );
          let split = frDate.split(" ");
          let splitDate = split[0].split("/");
          let splitHour = split[1].split(":");
          let year = splitDate[2];
          let month =
            splitDate[1].charAt(0) === "0"
              ? splitDate[1].slice(1)
              : splitDate[1];
          let date =
            splitDate[0].charAt(0) === "0"
              ? splitDate[0].slice(1)
              : splitDate[0];
          let hour =
            splitHour[0].charAt(0) === "0"
              ? splitHour[0].slice(1)
              : splitHour[0];
          if (
            year.toString() === newar[y].getFullYear().toString() &&
            month.toString() === (newar[y].getMonth() + 1).toString() &&
            date.toString() === newar[y].getDate().toString()
          ) {
            arWeek.push([year, month, date, hour, copyEvents[i]["userId"]]);
          }
        }
        if (arWeek.length > 0) {
          ar.push([
            [
              newar[y].getFullYear(),
              newar[y].getMonth() + 1,
              newar[y].getDate(),
              newar[y].getDay(),
            ],
            [arWeek],
          ]);
          arWeek = [];
        } else {
          ar.push([
            [
              newar[y].getFullYear(),
              newar[y].getMonth() + 1,
              newar[y].getDate(),
              newar[y].getDay(),
            ],
          ]);
          arWeek = [];
        }
      }
      setArDateWeek(ar);
    };

    function getAllDayInWeek(test: any) {
      var week = new Array();
      let current = new Date(test);
      current.setDate(current.getDate() - current.getDay() + 1);
      setStartDateWeek(current.toDateString());
      for (var i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      week.splice(5, 2);
      return week;
    }
    if (
      isMobile === false &&
      userData &&
      userData.body &&
      userData.status === 200 &&
      userData.body.meetings &&
      arDateWeek.length === 0
    ) {
      if (startDateWeek === "") {
        let current = new Date();
        current.setDate(current.getDate() + 3);
        /* let ar = getAllDayInWeek(new Date());
        getMeetingByWeek(ar); */
        if (current.getDay() === 6) {
          current.setDate(current.getDate() + 2);
          let ar = getAllDayInWeek(new Date(current));
          getMeetingByWeek(ar);
        } else if (current.getDay() === 0) {
          current.setDate(current.getDate() + 1);
          let ar = getAllDayInWeek(new Date(current));
          getMeetingByWeek(ar);
        } else {
          let ar = getAllDayInWeek(new Date(current));
          getMeetingByWeek(ar);
        }
      } else {
        let current = new Date(startDateWeek);
        current.setDate(current.getDate());
        let ar = getAllDayInWeek(new Date(startDateWeek));
        getMeetingByWeek(ar);
      }
    } else if (
      isMobile === true &&
      choiceDate === null &&
      userData &&
      userData.status === 200 &&
      userData.body.meetings
    ) {
      const hourtext: any = {
        1: "8",
        2: "9",
        3: "10",
        4: "11",
        5: "12",
        6: "13",
        7: "14",
        8: "15",
        9: "16",
        10: "17",
        11: "18",
        12: "19",
        13: "20",
      };
      let current = new Date();
      current.setDate(current.getDate() + 3);
      /* let ar = getAllDayInWeek(new Date());
            getMeetingByWeek(ar); */
      if (current.getDay() === 6) {
        current.setDate(current.getDate() + 2);
        setChoiceDate(current);
      } else if (current.getDay() === 0) {
        current.setDate(current.getDate() + 1);
        setChoiceDate(current);
      } else {
        setChoiceDate(current);
      }
      let copyEvents = [...userData?.body.meetings];
      let ar = [];
      if (copyEvents.length > 0) {
        for (let y = 0; y < Object.entries(hourtext).length; y++) {
          for (let i = 0; i < copyEvents.length; i++) {
            let startDate = new Date(copyEvents[i]["startAt"]);
            let frDate = new Date(copyEvents[i]["startAt"]).toLocaleString(
              "fr-FR"
            );
            // if (startDate.getTime() > choiceDate.getTime()) {
            let split = frDate.split(" ");
            let splitDate = split[0].split("/");
            let splitHour = split[1].split(":");
            let year = splitDate[2];
            let month =
              splitDate[1].charAt(0) === "0"
                ? splitDate[1].slice(1)
                : splitDate[1];
            let date =
              splitDate[0].charAt(0) === "0"
                ? splitDate[0].slice(1)
                : splitDate[0];
            let hour =
              splitHour[0].charAt(0) === "0"
                ? splitHour[0].slice(1)
                : splitHour[0];
            if (
              year.toString() === current.getFullYear().toString() &&
              month.toString() === (current.getMonth() + 1).toString() &&
              date.toString() === current.getDate().toString() &&
              hour.toString() === hourtext[y + 1].toString()
            ) {
              /* if (month.toString() === current.getMonth().toString()) {
                if (date.toString() === current.getDate().toString()) { */
              ar.push([
                [
                  current.getFullYear(),
                  current.getMonth() + 1,
                  current.getDate(),
                  hourtext[y + 1],
                ],
                copyEvents[i],
              ]);
              break;
              /*  }
              } */
            } else {
              if (i === copyEvents.length - 1) {
                ar.push([
                  [
                    current.getFullYear(),
                    current.getMonth() + 1,
                    current.getDate(),
                    hourtext[y + 1],
                  ],
                  null,
                ]);
                break;
              }
            }
            //}
          }
        }
      } else {
        for (let y = 0; y < Object.entries(hourtext).length; y++) {
          ar.push([hourtext[y + 1], null]);
        }
      }
      setArMeeting(ar);
    }
  }, [arDateWeek, choiceDate, isMobile, startDateWeek, userData]);
  const changeDate = (wowtets: any) => {
    const getMeetingByWeek = (newar: any) => {
      let ar = [];

      let copyEvents: any = [...userData?.body.meetings];
      for (let y = 0; y < newar.length; y++) {
        let arWeek = [];
        for (let i = 0; i < copyEvents.length; i++) {
          let frDate = new Date(copyEvents[i]["startAt"]).toLocaleString(
            "fr-FR"
          );
          let split = frDate.split(" ");
          let splitDate = split[0].split("/");
          let splitHour = split[1].split(":");
          let year = splitDate[2];
          let month =
            splitDate[1].charAt(0) === "0"
              ? splitDate[1].slice(1)
              : splitDate[1];
          let date =
            splitDate[0].charAt(0) === "0"
              ? splitDate[0].slice(1)
              : splitDate[0];
          let hour =
            splitHour[0].charAt(0) === "0"
              ? splitHour[0].slice(1)
              : splitHour[0];
          if (
            year.toString() === newar[y].getFullYear().toString() &&
            month.toString() === (newar[y].getMonth() + 1).toString() &&
            date.toString() === newar[y].getDate().toString()
          ) {
            arWeek.push([year, month, date, hour, copyEvents[i]["userId"]]);
          }
        }
        if (arWeek.length > 0) {
          ar.push([
            [
              newar[y].getFullYear(),
              newar[y].getMonth() + 1,
              newar[y].getDate(),
            ],
            [arWeek],
          ]);
          arWeek = [];
        } else {
          ar.push([
            [
              newar[y].getFullYear(),
              newar[y].getMonth() + 1,
              newar[y].getDate(),
            ],
          ]);
          arWeek = [];
        }
      }
      setArDateWeek(ar);
    };
    function getAllDayInWeek(test: any) {
      var week = new Array();
      let current = new Date(test);
      current.setDate(current.getDate() - current.getDay() + 1);

      setStartDateWeek(current.toDateString());
      for (var i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      week.splice(5, 2);
      return week;
    }
    let wowtetss = new Date(wowtets);
    if (wowtetss.getDay() === 6) {
      wowtetss.setDate(wowtetss.getDate() + 2);
      let ar = getAllDayInWeek(new Date(wowtetss));
      getMeetingByWeek(ar);
    } else if (wowtetss.getDay() === 0) {
      wowtetss.setDate(wowtetss.getDate() + 1);
      let ar = getAllDayInWeek(new Date(wowtetss));
      getMeetingByWeek(ar);
    } else {
      let ar = getAllDayInWeek(new Date(wowtetss));
      getMeetingByWeek(ar);
    }
  };
  const previous = () => {
    let start = new Date(startDateWeek);

    /* let end = new Date(startDateWeek);
    end.setDate(end.getDate() + 5); */
    let current = new Date();
    let startPrevious = new Date(start);
    startPrevious.setDate(startPrevious.getDate() - 7);
    let test = new Date();
    test.setDate(test.getDate() - 1);
    if (new Date(startPrevious).getTime() > new Date().getTime()) {
      start.setDate(start.getDate() - 7);
      changeDate(start.toDateString());
    } else {
      let limitDate = new Date();
      limitDate.setDate(limitDate.getDate() + 3);
      if (limitDate.getDay() === 6 || limitDate.getDay() === 0) {
      } else {
        let dayWeek = [];
        for (let i = 0; i < 5; i++) {
          dayWeek.push(new Date(startPrevious));
          if (current.getDate() === startPrevious.getDate()) {
            start.setDate(start.getDate() - 7);
            changeDate(start.toDateString());

            break;
          }
          startPrevious.setDate(startPrevious.getDate() + 1);
        }
      }
    }
  };
  const next = () => {
    let next = new Date(startDateWeek);
    next.setDate(next.getDate() + 7);
    changeDate(next.toDateString());
    //setArDateWeek([]);
  };
  const handlerClick = (h: any, p: any) => {
    let create = new Date(p[0][0], p[0][1] - 1, p[0][2], h);
    if (new Date(create).getTime() > new Date().getTime()) {
      dispatch({
        type: "ModalEditDiscoveryMeeting/open",
        payload: {
          date: create,
        },
      });
    }
  };

  const nextMobile = () => {
    if (choiceDate) {
      let copyChoiceDate = new Date(choiceDate);
      if (copyChoiceDate.getDay() === 5) {
        copyChoiceDate.setDate(copyChoiceDate.getDate() + 3);
        setChoiceDate(copyChoiceDate);
        getDate(copyChoiceDate);
      } else {
        copyChoiceDate.setDate(copyChoiceDate.getDate() + 1);
        setChoiceDate(copyChoiceDate);
        getDate(copyChoiceDate);
      }
    }
  };

  const previousMobile = () => {
    if (choiceDate) {
      let limitDate = new Date();
      let copyChoiceDate = new Date(choiceDate);
      limitDate.setDate(limitDate.getDate() + 3);
      if (new Date(copyChoiceDate).getTime() >= new Date(limitDate).getTime()) {
        let previousDate = new Date(
          copyChoiceDate.setDate(copyChoiceDate.getDate() - 1)
        );
        if (previousDate.getDay() === 0) {
          if (
            previousDate.getDate() === new Date().getDate() &&
            previousDate.getMonth() === new Date().getMonth() &&
            previousDate.getFullYear() === new Date().getFullYear()
          ) {
          } else {
            copyChoiceDate.setDate(copyChoiceDate.getDate() - 2);
            setChoiceDate(copyChoiceDate);
            getDate(copyChoiceDate);
          }
        } else if (previousDate.getDay() === 5) {
          if (
            previousDate.getDate() === new Date().getDate() &&
            previousDate.getMonth() === new Date().getMonth() &&
            previousDate.getFullYear() === new Date().getFullYear()
          ) {
          } else {
            copyChoiceDate.setDate(copyChoiceDate.getDate() - 1);
            setChoiceDate(copyChoiceDate);
            getDate(copyChoiceDate);
          }
        } else {
          setChoiceDate(copyChoiceDate);
          getDate(copyChoiceDate);
        }
      }
    }
  };

  const goCurrentMobile = () => {
    let current = new Date();
    current.setDate(current.getDate() + 3);
    if (current.getDay() === 6) {
      current.setDate(current.getDate() + 2);
      setChoiceDate(current);

      getDate(current);
    } else if (current.getDay() === 0) {
      current.setDate(current.getDate() + 1);
      setChoiceDate(current);
      getDate(current);
    } else {
      setChoiceDate(current);
      getDate(current);
    }
  };
  const changeMonth = (month: string) => {
    let copyDate = new Date(choiceDate);
    let newDate: any;
    Object.keys(monthstext).forEach((p) => {
      if (month === monthstext[p]) {
        let getAllDay = getAllDaysInMonth(
          Number(p) - 1,
          copyDate.getFullYear()
        );
        if (copyDate.getDate() > getAllDay[getAllDay.length - 1].getDate()) {
          if (
            new Date().getTime() <
            new Date(
              copyDate.getFullYear(),
              Number(p) - 1,
              getAllDay[getAllDay.length - 1].getDate()
            ).getTime()
          ) {
            if (
              new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                getAllDay[getAllDay.length - 1].getDate()
              ).getDay() === 0
            ) {
              newDate = new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                getAllDay[getAllDay.length - 1].getDate() + 1
              );
              setChoiceDate(newDate);
              getDate(newDate);
            } else if (
              new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                getAllDay[getAllDay.length - 1].getDate()
              ).getDay() === 6
            ) {
              newDate = new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                getAllDay[getAllDay.length - 1].getDate() + 2
              );
              setChoiceDate(newDate);
              getDate(newDate);
            } else {
              newDate = new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                getAllDay[getAllDay.length - 1].getDate()
              );
              setChoiceDate(newDate);
              getDate(newDate);
            }
          } else {
            let current = new Date();
            current.setDate(current.getDate() + 3);
            setChoiceDate(current);
            getDate(current);
          }
        } else {
          if (
            new Date().getTime() <
            new Date(
              copyDate.getFullYear(),
              Number(p) - 1,
              copyDate.getDate()
            ).getTime()
          ) {
            if (
              new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                copyDate.getDate()
              ).getDay() === 0
            ) {
              newDate = new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                copyDate.getDate() + 1
              );
              setChoiceDate(newDate);
              getDate(newDate);
            } else if (
              new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                copyDate.getDate()
              ).getDay() === 6
            ) {
              newDate = new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                copyDate.getDate() + 2
              );
              setChoiceDate(newDate);
              getDate(newDate);
            } else {
              newDate = new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                copyDate.getDate()
              );
              setChoiceDate(newDate);
              getDate(newDate);
            }
          } else {
            let current = new Date();
            current.setDate(current.getDate() + 3);
            setChoiceDate(current);
            getDate(current);
          }
        }
      }
    });
  };
  const changeYear = (year: any) => {
    let copyDate = new Date(choiceDate);
    let newDate: any;
    if (
      new Date(year, copyDate.getMonth(), copyDate.getDate()).getTime() >
      new Date().getTime()
    ) {
      if (
        new Date(year, copyDate.getMonth(), copyDate.getDate()).getDay() === 0
      ) {
        newDate = new Date(year, copyDate.getMonth(), copyDate.getDate() + 1);
        setChoiceDate(newDate);
        getDate(newDate);
      } else if (
        new Date(year, copyDate.getMonth(), copyDate.getDate()).getDay() === 6
      ) {
        newDate = new Date(year, copyDate.getMonth(), copyDate.getDate() + 2);
        setChoiceDate(newDate);
        getDate(newDate);
      } else {
        newDate = new Date(year, copyDate.getMonth(), copyDate.getDate());
        setChoiceDate(newDate);
        getDate(newDate);
      }
    } else {
      let current = new Date();
      current.setDate(current.getDate() + 3);
      setChoiceDate(current);
      getDate(current);
    }
  };
  const changeDay = (day: any) => {
    let copyDate = new Date(choiceDate);
    let newDate: any;
    if (
      new Date(copyDate.getFullYear(), copyDate.getMonth(), day).getTime() >
      new Date().getTime()
    ) {
      newDate = new Date(copyDate.getFullYear(), copyDate.getMonth(), day);
      setChoiceDate(newDate);
      getDate(newDate);
    } else {
      let current = new Date();
      current.setDate(current.getDate() + 3);
      setChoiceDate(current);
      getDate(current);
    }
  };

  const getDate = (date: any) => {
    let aa = new Date(date);
    let copyEvents = [...userData?.body.meetings];
    let ar = [];
    const hourtext: any = {
      1: "8",
      2: "9",
      3: "10",
      4: "11",
      5: "12",
      6: "13",
      7: "14",
      8: "15",
      9: "16",
      10: "17",
      11: "18",
      12: "19",
      13: "20",
    };

    if (copyEvents.length > 0) {
      for (let y = 0; y < Object.entries(hourtext).length; y++) {
        for (let i = 0; i < copyEvents.length; i++) {
          let startDate = new Date(copyEvents[i]["startAt"]);
          let frDate = new Date(copyEvents[i]["startAt"]).toLocaleString(
            "fr-FR"
          );
          // if (startDate.getTime() > choiceDate.getTime()) {
          let split = frDate.split(" ");
          let splitDate = split[0].split("/");
          let splitHour = split[1].split(":");
          let year = splitDate[2];
          let month =
            splitDate[1].charAt(0) === "0"
              ? splitDate[1].slice(1)
              : splitDate[1];
          let date =
            splitDate[0].charAt(0) === "0"
              ? splitDate[0].slice(1)
              : splitDate[0];
          let hour =
            splitHour[0].charAt(0) === "0"
              ? splitHour[0].slice(1)
              : splitHour[0];
          if (
            year.toString() === aa.getFullYear().toString() &&
            month.toString() === (aa.getMonth() + 1).toString() &&
            date.toString() === aa.getDate().toString() &&
            hour.toString() === hourtext[y + 1].toString()
          ) {
            /* if (month.toString() === current.getMonth().toString()) {
              if (date.toString() === current.getDate().toString()) { */
            ar.push([
              [
                aa.getFullYear(),
                aa.getMonth() + 1,
                aa.getDate(),
                hourtext[y + 1],
              ],
              copyEvents[i],
            ]);
            break;
            /*  }
            } */
          } else {
            if (i === copyEvents.length - 1) {
              ar.push([
                [
                  aa.getFullYear(),
                  aa.getMonth() + 1,
                  aa.getDate(),
                  hourtext[y + 1],
                ],
                null,
              ]);
              break;
            }
          }
          //}
        }
      }
    } else {
      for (let y = 0; y < Object.entries(hourtext).length; y++) {
        ar.push([hourtext[y + 1], null]);
      }
    }

    setArMeeting(ar);
  };

  const goCurrent = () => {
    let limit = new Date();
    limit.setDate(limit.getDate() + 3);
    if (limit.getDay() === 6) {
      limit.setDate(limit.getDate() + 2);
    } else if (limit.getDay() === 0) {
      limit.setDate(limit.getDate() + 1);
    }
    limit.setDate(limit.getDate() - limit.getDay() + 1);
    if (startDateWeek !== limit.toDateString()) {
      let current = new Date();
      current.setDate(current.getDate() + 3);
      changeDate(current.toDateString());
      setArDateWeek([]);
    }
  };
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalDatePickerEditDiscovery/close",
    });
  };
  function getAllDaysInMonth(month: any, year: any) {
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    while (date.getUTCMonth() === month) {
      days.push(new Date(date));
      date.setUTCDate(date.getUTCDate() + 1);
    }
    return days;
  }
  return (
    <>
      <AnimatePresence>
        {displayModalDatePickerEditDiscovery === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
              className={styles.container}
              onClick={() => {
                if (userClickSelectDay === true) {
                  setUserClickSelectDay(false);
                } else if (userClickSelectMonth === true) {
                  setUserClickSelectMonth(false);
                } else if (userClickSelectYear === true) {
                  setUserClickSelectYear(false);
                }
              }}
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
              <h2 style={{ marginBottom: "50px", marginTop: "50px" }}>
                Sélectionnez une date pour modifier votre rendez-vous de
                découverte
              </h2>
              <button className={styles.btn} onClick={() => closeForm()}>
                <Image
                  className={styles.btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              {isMobile === false && (
                <div className={styles.datePicker}>
                  <div className={styles.datePicker__head}>
                    <span
                      onClick={() => {
                        previous();
                      }}
                      className={styles.datePicker__head__previous}
                    ></span>
                    <div
                      className={styles.datePicker__head__home}
                      onClick={() => {
                        goCurrent();
                      }}
                    ></div>
                    {arDateWeek && arDateWeek.length > 0 && (
                      <div className={styles.datePicker__head__div}>
                        {arDateWeek[0][0][1] ===
                          arDateWeek[arDateWeek.length - 1][0][1] && (
                          <>
                            <p
                              className={styles.datePicker__head__div__marginR}
                            >
                              {arDateWeek[0][0][2]}
                            </p>
                            <p>-</p>
                            <p
                              className={styles.datePicker__head__div__marginL}
                            >
                              {arDateWeek[arDateWeek.length - 1][0][2]}
                            </p>
                            <p
                              className={styles.datePicker__head__div__marginL}
                            >
                              {monthstext[arDateWeek[0][0][1]]}
                            </p>
                          </>
                        )}
                        {arDateWeek[0][0][1] !==
                          arDateWeek[arDateWeek.length - 1][0][1] && (
                          <>
                            <p
                              className={styles.datePicker__head__div__marginR}
                            >
                              {arDateWeek[0][0][2]}
                            </p>
                            <p
                              className={styles.datePicker__head__div__marginR}
                            >
                              {monthstext[arDateWeek[0][0][1]]}
                            </p>
                            <p>-</p>
                            <p
                              className={styles.datePicker__head__div__marginL}
                            >
                              {arDateWeek[arDateWeek.length - 1][0][2]}
                            </p>
                            <p
                              className={styles.datePicker__head__div__marginL}
                            >
                              {
                                monthstext[
                                  arDateWeek[arDateWeek.length - 1][0][1]
                                ]
                              }
                            </p>
                          </>
                        )}
                        <p className={styles.datePicker__head__div__marginL}>
                          {arDateWeek[0][0][0]}
                        </p>
                      </div>
                    )}
                    <span
                      onClick={() => {
                        next();
                      }}
                      className={styles.datePicker__head__next}
                    ></span>
                  </div>
                  <table className={styles.datePicker__table}>
                    <thead className={styles.datePicker__table__thead}>
                      <tr className={styles.datePicker__table__thead__tr}>
                        {arDateWeek.length > 0 &&
                          arDateWeek.map((p: any, index: any) => {
                            return (
                              <th
                                className={
                                  styles.datePicker__table__thead__tr__th
                                }
                                key={index}
                              >
                                <div
                                  className={
                                    styles.datePicker__table__thead__tr__th__day
                                  }
                                >
                                  <span>{daystext[p[0][3]]}</span>
                                  <span>
                                    {p[0][2]} {monthstext[p[0][1]]}
                                    {"."}
                                  </span>
                                </div>
                              </th>
                            );
                          })}
                      </tr>
                    </thead>
                    <tbody className={styles.datePicker__table__tbody}>
                      {hourtext &&
                        Object.entries(hourtext).map((h: any, index: any) => {
                          return (
                            <tr
                              key={index}
                              className={styles.datePicker__table__tbody__tr}
                            >
                              {arDateWeek.length > 0 &&
                                arDateWeek.map((p: any, index: any) => {
                                  if (p[1] && p[1].length > 0) {
                                    for (let y = 0; y < p[1][0].length; y++) {
                                      if (
                                        p[0][0].toString() ===
                                          p[1][0][y][0].toString() &&
                                        p[0][1].toString() ===
                                          p[1][0][y][1].toString() &&
                                        p[0][2].toString() ===
                                          p[1][0][y][2].toString()
                                      ) {
                                        if (
                                          h[1].toString() ===
                                          p[1][0][y][3].toString()
                                        ) {
                                          if (
                                            id.toString() ===
                                            p[1][0][y][4].toString()
                                          ) {
                                            return (
                                              <td
                                                className={`${styles.datePicker__table__tbody__tr__td}`}
                                                key={index}
                                              >
                                                <div
                                                  className={`${styles.datePicker__table__tbody__tr__td__div__previous} ${styles.datePicker__table__tbody__tr__td__meeting__me}`}
                                                >
                                                  <p
                                                    className={
                                                      styles.datePicker__table__tbody__tr__td__div__previous__p
                                                    }
                                                  >
                                                    votre rendez-vous
                                                  </p>
                                                </div>
                                              </td>
                                            );
                                          } else {
                                            return (
                                              <td
                                                className={`${styles.datePicker__table__tbody__tr__td} ${styles.datePicker__table__tbody__tr__td__previous}`}
                                                key={index}
                                              >
                                                <div
                                                  className={
                                                    styles.datePicker__table__tbody__tr__td__div__previous
                                                  }
                                                >
                                                  <p
                                                    className={
                                                      styles.datePicker__table__tbody__tr__td__div__previous__p
                                                    }
                                                  ></p>
                                                </div>
                                              </td>
                                            );
                                          }
                                        }
                                      }
                                    }
                                  }
                                  let current = new Date();
                                  current.setDate(current.getDate() + 3);
                                  if (
                                    current.getTime() <
                                    new Date(
                                      p[0][0],
                                      p[0][1] - 1,
                                      p[0][2],
                                      h[1]
                                    ).getTime()
                                  ) {
                                    return (
                                      <td
                                        className={
                                          styles.datePicker__table__tbody__tr__td
                                        }
                                        key={index}
                                      >
                                        <div
                                          className={
                                            styles.datePicker__table__tbody__tr__td__div
                                          }
                                          onClick={() => {
                                            handlerClick(h[1], p);
                                          }}
                                        >
                                          <p
                                            className={
                                              styles.datePicker__table__tbody__tr__td__div__p
                                            }
                                          >
                                            {h[1]} h
                                          </p>
                                        </div>
                                      </td>
                                    );
                                  } else {
                                    return (
                                      <td
                                        className={`${styles.datePicker__table__tbody__tr__td} ${styles.datePicker__table__tbody__tr__td__previous}`}
                                        key={index}
                                      >
                                        <div
                                          className={
                                            styles.datePicker__table__tbody__tr__td__div__previous
                                          }
                                        >
                                          <p
                                            className={
                                              styles.datePicker__table__tbody__tr__td__div__previous__p
                                            }
                                          ></p>
                                        </div>
                                      </td>
                                    );
                                  }
                                  //
                                })}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
              {isMobile === true && choiceDate && (
                <div className={styles.datePickermobile}>
                  <div className={styles.datePickermobile__headMobile}>
                    <span
                      onClick={() => {
                        previousMobile();
                        setUserClickSelectDay(false);
                        setUserClickSelectMonth(false);
                        setUserClickSelectYear(false);
                      }}
                      className={styles.datePickermobile__headMobile__previous}
                    ></span>
                    <div
                      className={styles.datePickermobile__headMobile__home}
                      onClick={() => {
                        goCurrentMobile();
                        setUserClickSelectDay(false);
                        setUserClickSelectMonth(false);
                        setUserClickSelectYear(false);
                      }}
                    ></div>

                    <div className={styles.datePickermobile__headMobile__div}>
                      <div
                        className={`${styles.datePickermobile__headMobile__div__div} ${styles.datePickermobile__headMobile__div__div__day}`}
                        onClick={() => {
                          let arday = getAllDaysInMonth(
                            choiceDate.getMonth(),
                            choiceDate.getFullYear()
                          );
                          let ar = [];
                          for (let i = 0; i < arday.length; i++) {
                            ar.push(arday[i].getDate());
                          }
                          setUserClickSelectDay(!userClickSelectDay);
                          setUserClickSelectMonth(false);
                          setUserClickSelectYear(false);
                          setArDay(ar);
                        }}
                      >
                        <p
                          className={`${styles.datePickermobile__headMobile__div__div__p} ${styles.datePickermobile__headMobile__div__marginR}`}
                        >
                          {choiceDate.getDate()}
                        </p>
                        <div
                          className={
                            styles.datePickermobile__headMobile__div__div__i
                          }
                        >
                          {userClickSelectDay === true && (
                            <div
                              className={
                                styles.datePickermobile__headMobile__div__div__div
                              }
                            >
                              {arDay &&
                                arDay.length > 0 &&
                                arDay.map((p: any, index: any) => {
                                  if (p === choiceDate.getDate()) {
                                    return (
                                      <div
                                        onClick={() => {
                                          changeDay(p);
                                        }}
                                        className={
                                          styles.datePickermobile__headMobile__div__div__div__div__current
                                        }
                                        key={index}
                                      >
                                        {p}
                                      </div>
                                    );
                                  }
                                  return (
                                    <div
                                      onClick={() => {
                                        changeDay(p);
                                      }}
                                      className={
                                        styles.datePickermobile__headMobile__div__div__div__div
                                      }
                                      key={index}
                                    >
                                      {p}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`${styles.datePickermobile__headMobile__div__div} ${styles.datePickermobile__headMobile__div__div__month}`}
                        onClick={() => {
                          setUserClickSelectMonth(!userClickSelectMonth);
                          setUserClickSelectDay(false);
                          setUserClickSelectYear(false);
                        }}
                      >
                        <p
                          className={`${styles.datePickermobile__headMobile__div__div__p} ${styles.datePickermobile__headMobile__div__div__marginR}`}
                        >
                          {monthstext[choiceDate.getMonth() + 1]}
                        </p>
                        <div
                          className={
                            styles.datePickermobile__headMobile__div__div__i
                          }
                        >
                          {userClickSelectMonth === true && (
                            <div
                              className={
                                styles.datePickermobile__headMobile__div__div__div
                              }
                            >
                              {Object.entries(monthstext).map(
                                (p: any, index: any) => {
                                  if (
                                    monthstext[choiceDate.getMonth() + 1] ===
                                    p[1]
                                  ) {
                                    return (
                                      <div
                                        onClick={() => {
                                          changeMonth(p[1]);
                                        }}
                                        className={
                                          styles.datePickermobile__headMobile__div__div__div__div__current
                                        }
                                        key={index}
                                      >
                                        {p[1]}
                                      </div>
                                    );
                                  }
                                  return (
                                    <div
                                      onClick={() => {
                                        changeMonth(p[1]);
                                      }}
                                      className={
                                        styles.datePickermobile__headMobile__div__div__div__div
                                      }
                                      key={index}
                                    >
                                      {p[1]}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`${styles.datePickermobile__headMobile__div__div} ${styles.datePickermobile__headMobile__div__div__year}`}
                        onClick={() => {
                          setUserClickSelectYear(!userClickSelectYear);
                          setUserClickSelectDay(false);
                          setUserClickSelectMonth(false);
                        }}
                      >
                        <p
                          className={
                            styles.datePickermobile__headMobile__div__div__p
                          }
                        >
                          {choiceDate.getFullYear()}
                        </p>
                        <div
                          className={
                            styles.datePickermobile__headMobile__div__div__i
                          }
                        >
                          {userClickSelectYear && (
                            <div
                              className={
                                styles.datePickermobile__headMobile__div__div__div
                              }
                            >
                              {Object.entries(yearar).map(
                                (p: any, index: any) => {
                                  if (choiceDate.getFullYear() === p[1]) {
                                    return (
                                      <div
                                        onClick={() => {
                                          changeYear(p[1]);
                                        }}
                                        className={
                                          styles.datePickermobile__headMobile__div__div__div__div__current
                                        }
                                        key={index}
                                      >
                                        {p[1]}
                                      </div>
                                    );
                                  }
                                  return (
                                    <div
                                      onClick={() => {
                                        changeYear(p[1]);
                                      }}
                                      className={
                                        styles.datePickermobile__headMobile__div__div__div__div
                                      }
                                      key={index}
                                    >
                                      {p[1]}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      onClick={() => {
                        nextMobile();
                        setUserClickSelectDay(false);
                        setUserClickSelectMonth(false);
                        setUserClickSelectYear(false);
                      }}
                      className={styles.datePickermobile__headMobile__next}
                    ></span>
                  </div>
                  <table className={styles.datePickermobile__table}>
                    <thead className={styles.datePickermobile__table__thead}>
                      <tr className={styles.datePickermobile__table__thead__tr}>
                        <th
                          className={
                            styles.datePickermobile__table__thead__tr__th__day
                          }
                        >
                          {daystext[choiceDate.getDay()]} {choiceDate.getDate()}{" "}
                          {monthstext[choiceDate.getMonth() + 1]}{" "}
                          {choiceDate.getFullYear()}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {arMeeting &&
                        arMeeting.map((p: any, index: any) => {
                          let dateDayMeeting = new Date(p.startAt);
                          if (p[1] !== null) {
                            if (p[1]["userId"] === id) {
                              return (
                                <tr
                                  key={index}
                                  className={
                                    styles.datePickermobile__table__tbody__tr
                                  }
                                >
                                  <td
                                    className={`${styles.datePickermobile__table__tbody__tr__td} ${styles.datePickermobile__table__tbody__tr__td__meeting__me}`}
                                    key={index}
                                  >
                                    <div
                                      className={
                                        styles.datePickermobile__table__tbody__tr__td__meeting__me
                                      }
                                    >
                                      <p
                                        className={
                                          styles.datePickermobile__table__tbody__tr__td__div__previous__p
                                        }
                                      >
                                        Mon rendez-vous
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            } else {
                              return (
                                <tr
                                  key={index}
                                  className={
                                    styles.datePickermobile__table__tbody__tr
                                  }
                                >
                                  <td
                                    className={`${styles.datePickermobile__table__tbody__tr__td}`}
                                    key={index}
                                  >
                                    <div
                                      className={`${styles.datePickermobile__table__tbody__tr__td__div__previous} ${styles.datePickermobile__table__tbody__tr__td__meeting__me}`}
                                    >
                                      <p
                                        className={
                                          styles.datePickermobile__table__tbody__tr__td__div__previous__p
                                        }
                                      ></p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          } else {
                            let current = new Date();
                            current.setDate(current.getDate() + 3);
                            if (
                              current.getTime() >
                              new Date(
                                p[0][0],
                                p[0][1] - 1,
                                p[0][2],
                                p[0][3]
                              ).getTime()
                            ) {
                              return (
                                <tr
                                  key={index}
                                  className={
                                    styles.datePickermobile__table__tbody__tr
                                  }
                                >
                                  <td
                                    className={`${styles.datePickermobile__table__tbody__tr__td} ${styles.datePickermobile__table__tbody__tr__td__previous}`}
                                    key={index}
                                  >
                                    <div
                                      className={
                                        styles.datePickermobile__table__tbody__tr__td__div__previous
                                      }
                                    >
                                      <p
                                        className={
                                          styles.datePickermobile__table__tbody__tr__td__div__previous__p
                                        }
                                      ></p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            } else {
                              return (
                                <tr
                                  key={index}
                                  className={
                                    styles.datePickermobile__table__tbody__tr
                                  }
                                >
                                  <td
                                    className={
                                      styles.datePickermobile__table__tbody__tr__td
                                    }
                                    key={index}
                                  >
                                    <div
                                      className={
                                        styles.datePickermobile__table__tbody__tr__td__div
                                      }
                                      onClick={() => {
                                        handlerClick(p[0][3], p);

                                        /* handlerClick(
                                choiceDate.getFullYear(),
                                choiceDate.getMonth(),
                                choiceDate.getDate(),
                                h[1]
                              ); */
                                      }}
                                    >
                                      <p
                                        className={
                                          styles.datePickermobile__table__tbody__tr__td__div__p
                                        }
                                      >
                                        {p[0][3]}h00
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          }
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalDatePickerEditDiscovery;
