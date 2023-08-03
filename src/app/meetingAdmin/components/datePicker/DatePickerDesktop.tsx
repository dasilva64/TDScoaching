"use client";

import React, { useEffect, useState } from "react";
import styles from "./DatePickerDesktop.module.scss";
import Image from "next/image";
import fetchCreate from "@/app/components/fetch/meeting/fetchCreate";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { useSelector } from "react-redux";
import Link from "next/link";

const DatePickerDesktop = ({ events }: any) => {
  const { id } = useSelector((state: any) => state.auth);
  const [arDateWeek, setArDateWeek] = useState<any>([]);
  const [all, setAll] = useState<any>(null);
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

  const { data, trigger } = useSWRMutation("/api/meeting/add", fetchCreate);
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate(
          "/api/meeting/getAllAfterNow",
          {
            ...data,
            body: [...data.body],
          },
          { revalidate: false }
        );
      }
    }
  }, [data]);

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
    };
    function getAllDayInWeek(current: any) {
      let week = new Array();
      let currentDate = new Date(current);
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      setStartDateWeek(currentDate.toDateString());
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      week.splice(5, 2);
      return week;
    }
    if (arDateWeek.length === 0) {
      if (startDateWeek === "") {
        setAll(events);
        let current = new Date();
        current.setDate(current.getDate());
        let ar = getAllDayInWeek(new Date());
        getMeetingByWeek(ar);
      } else {
        let current = new Date(startDateWeek);
        current.setDate(current.getDate());
        let ar = getAllDayInWeek(new Date(startDateWeek));
        getMeetingByWeek(ar);
      }
    }
    if (events.length > all?.length) {
      let current = new Date(startDateWeek);
      current.setDate(current.getDate());
      let ar = getAllDayInWeek(new Date(startDateWeek));
      getMeetingByWeek(ar);
      setAll(events);
    }
  }, [all, arDateWeek, events, startDateWeek]);

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
          let test = new Date(wowtets[y]);
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
          let test = new Date(wowtets[y]);
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
    let newar = [];
    let ar = getAllDayInWeek(wowtets);
    for (let i = 0; i < ar.length; i++) {
      let d = new Date(ar[i]);
      newar.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay()]);
    }
    //setArDateWeek(newar);
    getMeetingByWeek(ar);
  };

  const previous = () => {
    let next = new Date(startDateWeek);

    let test = new Date();
    if (new Date(next).getTime() > new Date().getTime()) {
      next.setDate(next.getDate() - 7);
      changeDate(next.toDateString());
      setArDateWeek([]);
    }
  };

  const next = () => {
    let next = new Date(startDateWeek);
    next.setDate(next.getDate() + 7);
    changeDate(next.toDateString());
    setArDateWeek([]);
  };

  const goCurrent = () => {
    let current = new Date();
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
                                } else {
                                  console.log(p);
                                  return (
                                    <td
                                      className={
                                        styles.datePicker__table__tbody__tr__td__meeting__me
                                      }
                                      key={index}
                                    >
                                      <Link
                                        href={`/utilisateur/${p[1][0][y][5]}`}
                                      >
                                        {p[1][0][y][6]} {p[1][0][y][7]}
                                      </Link>
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
                                let create = new Date(
                                  p[0][0],
                                  p[0][1] - 1,
                                  p[0][2],
                                  h[1]
                                );
                                let startstr = "";
                                let endstr = "";
                                create
                                  .toLocaleString()
                                  .split(" ")
                                  .map((el, index) => {
                                    if (index === 0) {
                                      el.split("/")
                                        .reverse()
                                        .map((el) => {
                                          startstr = startstr + el + "-";
                                        });
                                    } else {
                                      el.split(":").map((el) => {
                                        endstr = endstr + el + ":";
                                      });
                                    }
                                  });
                                let formatDate =
                                  startstr.slice(0, startstr.length - 1) +
                                  "T" +
                                  endstr.slice(0, endstr.length - 1) +
                                  ".000Z";
                                trigger({ start: formatDate });
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
