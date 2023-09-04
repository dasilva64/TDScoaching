"use client";

import React, { useEffect, useState } from "react";
import styles from "./DatePickerEditDesktop.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";

const DatePickerEditDesktop = ({ events, discovery, typeMeeting }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [arDateWeek, setArDateWeek] = useState<any>([]);
  const [all, setAll] = useState<any>(null);
  const { id } = useSelector((state: RootState) => state.auth);

  const [startDateWeek, setStartDateWeek] = useState<string>("");
  const daystext: any = {
    1: "Lundi",
    2: "Mardi",
    3: "Mercredi",
    4: "Jeudi",
    5: "vendredi",
  };

  const monthstext: any = {
    1: "Janvier",
    2: "Février",
    3: "Mars",
    4: "Avril",
    5: "Mai",
    6: "Juin",
    7: "Juillet",
    8: "Août",
    9: "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
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

  useEffect(() => {
    const getMeetingByWeek = (newar: any) => {
      let ar = [];

      let copyEvents = [...events];
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
    if (arDateWeek.length === 0) {
      if (startDateWeek === "") {
        setAll(events);
        let current = new Date();
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
    }
    if (events.length > all?.length || events.length < all?.length) {
      let current = new Date(startDateWeek);
      current.setDate(current.getDate());
      let ar = getAllDayInWeek(new Date(startDateWeek));
      getMeetingByWeek(ar);
      setAll(events);
    }
  }, [all?.length, arDateWeek, events, startDateWeek]);
  const changeDate = (wowtets: any) => {
    const getMeetingByWeek = (newar: any) => {
      let ar = [];

      let copyEvents = [...events];
      for (let y = 0; y < newar.length; y++) {
        let arWeek = [];
        for (let i = 0; i < copyEvents.length; i++) {
          let startDate = new Date(copyEvents[i]["startAt"]);
          let eventDate = startDate.getDate();
          let eventDay = startDate.getDay();
          let eventMonth = startDate.getMonth();
          let eventYear = startDate.getFullYear();
          let eventHour = startDate.getUTCHours();

          if (
            eventYear.toString() === newar[y].getFullYear().toString() &&
            (eventMonth + 1).toString() ===
              (newar[y].getMonth() + 1).toString() &&
            eventDate.toString() === newar[y].getDate().toString()
          ) {
            let copyUser: any = { ...copyEvents[i].User };
            arWeek.push([
              eventYear,
              eventMonth + 1,
              eventDate,
              eventDay,
              eventHour,
              copyUser.id,
              copyUser.firstname,
              copyUser.lastname,
            ]);
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

    let end = new Date(startDateWeek);
    end.setDate(end.getDate() + 5);
    let current = new Date();
    let startPrevious = new Date(start);
    startPrevious.setDate(startPrevious.getDate() - 7);
    let test = new Date();
    test.setDate(test.getDate() - 1);
    if (new Date(startPrevious).getTime() > new Date().getTime()) {
      start.setDate(start.getDate() - 7);
      changeDate(start.toDateString());
      setArDateWeek([]);
    } else {
      let dayWeek = [];
      for (let i = 0; i < 5; i++) {
        dayWeek.push(new Date(startPrevious));
        if (current.getDate() === startPrevious.getDate()) {
          start.setDate(start.getDate() - 7);
          changeDate(start.toDateString());
          setArDateWeek([]);
          break;
        }
        startPrevious.setDate(startPrevious.getDate() + 1);
      }
    }
  };

  const next = () => {
    let next = new Date(startDateWeek);
    next.setDate(next.getDate() + 7);
    changeDate(next.toDateString());
    setArDateWeek([]);
  };
  const handlerClick = (h: any, p: any) => {
    let create = new Date(p[0][0], p[0][1] - 1, p[0][2], h);
    if (new Date(create).getTime() > new Date().getTime()) {
      dispatch({
        type: "form/openModalEditMeeting",
        payload: {
          date: create,
        },
      });
    }
  };

  const goCurrent = () => {
    let current = new Date();
    changeDate(current.toDateString());
    setArDateWeek([]);
  };
  return (
    <>
      <div className={styles.datePicker}>
        <div className={styles.datePicker__head}>
          <span
            onClick={() => {
              previous();
            }}
            className={styles.datePicker__head__previous}
          ></span>
          <Image
            onClick={() => {
              goCurrent();
            }}
            src="/assets/icone/home.png"
            alt=""
            width={"20"}
            height={"20"}
          />
          {arDateWeek && arDateWeek.length > 0 && (
            <div className={styles.datePicker__head__div}>
              {arDateWeek[0][0][1] ===
                arDateWeek[arDateWeek.length - 1][0][1] && (
                <>
                  <p className={styles.datePicker__head__div__marginR}>
                    {arDateWeek[0][0][2]}
                  </p>
                  <p>-</p>
                  <p className={styles.datePicker__head__div__marginL}>
                    {arDateWeek[arDateWeek.length - 1][0][2]}
                  </p>
                  <p className={styles.datePicker__head__div__marginL}>
                    {monthstext[arDateWeek[0][0][1]]}
                  </p>
                </>
              )}
              {arDateWeek[0][0][1] !==
                arDateWeek[arDateWeek.length - 1][0][1] && (
                <>
                  <p className={styles.datePicker__head__div__marginR}>
                    {arDateWeek[0][0][2]}
                  </p>
                  <p className={styles.datePicker__head__div__marginR}>
                    {monthstext[arDateWeek[0][0][1]]}
                  </p>
                  <p>-</p>
                  <p className={styles.datePicker__head__div__marginL}>
                    {arDateWeek[arDateWeek.length - 1][0][2]}
                  </p>
                  <p className={styles.datePicker__head__div__marginL}>
                    {monthstext[arDateWeek[arDateWeek.length - 1][0][1]]}
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
                      className={styles.datePicker__table__thead__tr__th}
                      key={index}
                    >
                      <div
                        className={styles.datePicker__table__thead__tr__th__div}
                      >
                        <span>{p[0][2]}</span>
                        <span>{monthstext[p[0][1]]}</span>
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
                              p[0][0].toString() === p[1][0][y][0].toString() &&
                              p[0][1].toString() === p[1][0][y][1].toString() &&
                              p[0][2].toString() === p[1][0][y][2].toString()
                            ) {
                              if (
                                h[1].toString() === p[1][0][y][3].toString()
                              ) {
                                if (
                                  id.toString() === p[1][0][y][4].toString()
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
    </>
  );
};

export default DatePickerEditDesktop;
