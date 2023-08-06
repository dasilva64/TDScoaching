"use client";

import React, { useEffect, useState } from "react";
import styles from "./DatePickerDesktop.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import fetchGetPayment from "@/app/components/fetch/paiement/useGet";
import useSWRMutation from "swr/mutation";
import { AppDispatch } from "@/app/redux/store";

const DatePickerDesktop = ({ events }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [arDateWeek, setArDateWeek] = useState<any>([]);
  const [all, setAll] = useState<any>(null);
  const { id } = useSelector((state: any) => state.auth);

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
      /* for (let i = 0; i < copyEvents.length; i++) {
        let startDate = new Date(copyEvents[i]["startAt"]);
        let eventDate = startDate.getDate();
        let eventDay = startDate.getDay();
        let eventMonth = startDate.getMonth();
        let eventYear = startDate.getFullYear();
        let eventHour = startDate.getUTCHours();
        
        for (let y = 0; y < newar.length; y++) {
          if (
            eventYear.toString() === newar[y][0].toString() &&
            (eventMonth+1).toString() === newar[y][1].toString() &&
            eventDate.toString() === newar[y][2].toString()
          ) {
            console.log('test')
            ar.push([...newar[y], eventYear, eventMonth+1, eventDate, eventDay, eventHour])
          }
        }
      }
      let tes = []
      setArMeeting(ar) */
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
      /* let current = new Date();
      current.setDate(current.getDate());
      setChoiceDate(current.toDateString());
      let newar = [];
      let ar = getAllDayInWeek(new Date());
      for (let i = 0; i < ar.length; i++) {
        let d = new Date(ar[i]);
        newar.push([
          d.getFullYear(),
          d.getMonth() + 1,
          d.getDate(),
          d.getDay(),
        ]);
      } */

      //setArDateWeek(newar);
      //getMeetingByWeek(newar);
    }
    if (events.length > all?.length || events.length < all?.length) {
      let current = new Date(startDateWeek);
      current.setDate(current.getDate());
      let ar = getAllDayInWeek(new Date(startDateWeek));
      getMeetingByWeek(ar);
      setAll(events);
    }

    /* let newar = [];
    let ar = getAllDayInWeek(choiceDate);
    for (let i = 0; i < ar.length; i++) {
      let d = new Date(ar[i]);
      newar.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay()]);
    }
    setArDateWeek(newar); */
    //getMeetingByWeek();
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
      /* for (let i = 0; i < copyEvents.length; i++) {
        let startDate = new Date(copyEvents[i]["startAt"]);
        let eventDate = startDate.getDate();
        let eventDay = startDate.getDay();
        let eventMonth = startDate.getMonth();
        let eventYear = startDate.getFullYear();
        let eventHour = startDate.getUTCHours();
        
        for (let y = 0; y < newar.length; y++) {
          if (
            eventYear.toString() === newar[y][0].toString() &&
            (eventMonth+1).toString() === newar[y][1].toString() &&
            eventDate.toString() === newar[y][2].toString()
          ) {
            console.log('test')
            ar.push([...newar[y], eventYear, eventMonth+1, eventDate, eventDay, eventHour])
          }
        }
      }
      let tes = []
      setArMeeting(ar) */
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
    let newar = [];
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
    //let ar = getAllDayInWeek(wowtets);
    /* for (let i = 0; i < ar.length; i++) {
      let d = new Date(ar[i]);
      newar.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay()]);
    } */

    //setArDateWeek(newar);
    //getMeetingByWeek(newar);
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
    console.log(h);
    console.log(p);
    let create = new Date(p[0][0], p[0][1] - 1, p[0][2], h);
    let test = new Date();
    console.log(create);
    console.log(test);
    if (new Date(create).getTime() > new Date().getTime()) {
      console.log("test");
      dispatch({
        type: "form/openModalMeeting",
        payload: {
          date: create.toLocaleString(),
        },
      });
      /* setChoiceDate(create.toLocaleString());
      setDisplayModal(true); */
      // setDateMeeting(create.toLocaleString());
    }
  };

  const goCurrent = () => {
    let current = new Date();
    //setChoiceDate(current.toDateString());
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
                        <span>{daystext[p[0][3]]}</span>
                        <span>
                          {p[0][2]}/{p[0][1]}
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
                              p[0][0] === p[1][0][y][0] &&
                              p[0][1] === p[1][0][y][1] &&
                              p[0][2] === p[1][0][y][2] &&
                              p[0][3] === p[1][0][y][3]
                            ) {
                              if (
                                h[1].toString() === p[1][0][y][4].toString()
                              ) {
                                if (
                                  id.toString() === p[1][0][y][5].toString()
                                ) {
                                  return (
                                    <td
                                      onClick={() => {}}
                                      className={
                                        styles.datePicker__table__tbody__tr__td__meeting__me
                                      }
                                      key={index}
                                    >
                                      {h[1]}
                                    </td>
                                  );
                                } else {
                                  return (
                                    <td
                                      onClick={() => {}}
                                      className={
                                        styles.datePicker__table__tbody__tr__td__meeting__other
                                      }
                                      key={index}
                                    >
                                      {" "}
                                      <div
                                        className={
                                          styles.datePicker__table__tbody__tr__td__meeting__other__div
                                        }
                                      ></div>
                                    </td>
                                  );
                                }
                              }
                            }
                          }
                        }
                        console.log("current", new Date());
                        console.log(
                          new Date(p[0][0], p[0][1] - 1, p[0][2], h[1])
                        );
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

export default DatePickerDesktop;
