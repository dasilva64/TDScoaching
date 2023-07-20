"use client";

import React, { useEffect, useState } from "react";
import styles from "./DatePickerDesktop.module.scss";
import Image from "next/image";

const DatePickerDesktop = ({
  user,
  events,
  setDisplayModal,
  setDateMeeting,
}: any) => {
  const [arDateWeek, setArDateWeek] = useState<any>([]);
  const [choiceDate, setChoiceDate] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [startDateWeek, setStartDateWeek] = useState<string>("");
  const [arMeeting, setArMeeting] = useState<null | any>(null);
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
            eventYear.toString() === newar[y][0].toString() &&
            (eventMonth + 1).toString() === newar[y][1].toString() &&
            eventDate.toString() === newar[y][2].toString()
          ) {
            arWeek.push([
              eventYear,
              eventMonth + 1,
              eventDate,
              eventDay,
              eventHour,
              copyEvents[i]["userId"],
            ]);
          }
        }
        if (arWeek.length > 0) {
          ar.push([...newar[y], [arWeek]]);
          arWeek = [];
        } else {
          ar.push([...newar[y]]);
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
    if (choiceDate === "") {
      let current = new Date();
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
      }

      //setArDateWeek(newar);
      getMeetingByWeek(newar);
    }

    /* let newar = [];
    let ar = getAllDayInWeek(choiceDate);
    for (let i = 0; i < ar.length; i++) {
      let d = new Date(ar[i]);
      newar.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay()]);
    }
    setArDateWeek(newar); */
    //getMeetingByWeek();
  }, [arDateWeek, choiceDate, events]);

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
            eventYear.toString() === newar[y][0].toString() &&
            (eventMonth + 1).toString() === newar[y][1].toString() &&
            eventDate.toString() === newar[y][2].toString()
          ) {
            arWeek.push([
              eventYear,
              eventMonth + 1,
              eventDate,
              eventDay,
              eventHour,
              copyEvents[i]["userId"],
            ]);
          }
        }
        if (arWeek.length > 0) {
          ar.push([...newar[y], [arWeek]]);
          arWeek = [];
        } else {
          ar.push([...newar[y]]);
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
    let ar = getAllDayInWeek(wowtets);
    for (let i = 0; i < ar.length; i++) {
      let d = new Date(ar[i]);
      newar.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay()]);
    }

    //setArDateWeek(newar);
    getMeetingByWeek(newar);
  };

  const previous = () => {
    let next = new Date(startDateWeek);

    let test = new Date();
    if (new Date(next).getTime() > new Date().getTime()) {
      next.setDate(next.getDate() - 7);
      setChoiceDate(next.toDateString());
      changeDate(next.toDateString());
    }
  };

  const next = () => {
    let next = new Date(startDateWeek);
    next.setDate(next.getDate() + 7);
    setChoiceDate(next.toDateString());
    changeDate(next.toDateString());
  };
  const handlerClick = (h: any, p: any) => {
    let create = new Date(p[0], p[1] - 1, p[2], h);
    let test = new Date();
    if (new Date(create).getTime() > new Date().getTime()) {
      setDisplayModal(true);
      setDateMeeting(create.toLocaleString());
    }
  };

  const goCurrent = () => {
    let current = new Date();
    setChoiceDate(current.toDateString());
    changeDate(current.toDateString());
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
              {arDateWeek[0][1] === arDateWeek[arDateWeek.length - 1][1] && (
                <>
                  <p className={styles.datePicker__head__div__marginR}>
                    {arDateWeek[0][2].toString()}
                  </p>
                  <p>-</p>
                  <p className={styles.datePicker__head__div__marginL}>
                    {arDateWeek[arDateWeek.length - 1][2].toString()}
                  </p>
                  <p className={styles.datePicker__head__div__marginL}>
                    {monthstext[arDateWeek[0][1]]}
                  </p>
                </>
              )}
              {arDateWeek[0][1] !== arDateWeek[arDateWeek.length - 1][1] && (
                <>
                  <p className={styles.datePicker__head__div__marginR}>
                    {arDateWeek[0][2].toString()}
                  </p>
                  <p className={styles.datePicker__head__div__marginR}>
                    {monthstext[arDateWeek[0][1]]}
                  </p>
                  <p>-</p>
                  <p className={styles.datePicker__head__div__marginL}>
                    {arDateWeek[arDateWeek.length - 1][2].toString()}
                  </p>
                  <p className={styles.datePicker__head__div__marginL}>
                    {monthstext[arDateWeek[arDateWeek.length - 1][1]]}
                  </p>
                </>
              )}
              <p className={styles.datePicker__head__div__marginL}>
                {arDateWeek[0][0].toString()}
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
                        <span>{daystext[p[3]]}</span>
                        <span>
                          {p[2]}/{p[1]}
                        </span>
                      </div>
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody className={styles.datePicker__table__tbody}>
            {hourtext &&
              user &&
              Object.entries(hourtext).map((h: any, index: any) => {
                return (
                  <tr
                    key={index}
                    className={styles.datePicker__table__tbody__tr}
                  >
                    {/* <td className={styles.datePicker__table__tbody__tr__td__hour}>
                      {h[1]}h
                    </td> */}
                    {arDateWeek.length > 0 &&
                      arDateWeek.map((p: any, index: any) => {
                        if (p[4] && p[4].length > 0) {
                          for (let y = 0; y < p[4][0].length; y++) {
                            if (
                              p[0] === p[4][0][y][0] &&
                              p[1] === p[4][0][y][1] &&
                              p[2] === p[4][0][y][2]
                            ) {
                              if (
                                h[1].toString() === p[4][0][y][4].toString()
                              ) {
                                if (
                                  user.body.id.toString() ===
                                  p[4][0][y][5].toString()
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

                        //
                        return (
                          <td
                            className={styles.datePicker__table__tbody__tr__td}
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
