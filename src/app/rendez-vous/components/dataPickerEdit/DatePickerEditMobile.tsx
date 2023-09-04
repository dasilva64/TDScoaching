"use client";

import React, { useEffect, useState } from "react";
import styles from "./DatePickerEditMobile.module.scss";
import Image from "next/image";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const DatePickerEditMobile = ({
  user,
  events,
  setDisplayModal,
  setDateMeeting,
}: any) => {
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
  const daystext: any = {
    1: "Lundi",
    2: "Mardi",
    3: "Mercredi",
    4: "Jeudi",
    5: "vendredi",
  };

  const yearar: any = {
    0: 2023,
    1: 2024,
    2: 2025,
    3: 2026,
    4: 2027,
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

  const { id } = useSelector((state: RootState) => state.auth);
  const [choiceDate, setChoiceDate] = useState<null | any>(null);
  const [arMeeting, setArMeeting] = useState<null | any>(null);
  const [arDay, setArDay] = useState<any>([null]);
  const [userClickSelectMonth, setUserClickSelectMonth] =
    useState<boolean>(false);
  const [userClickSelectYear, setUserClickSelectYear] =
    useState<boolean>(false);
  const [userClickSelectDay, setUserClickSelectDay] = useState<boolean>(false);
  useEffect(() => {
    let current = new Date();
    if (choiceDate === null) {
      setChoiceDate(current);
      let copyEvents = [...events];
      let ar = [];
      for (let i = 0; i < copyEvents.length - 1; i++) {
        let startDate = new Date(copyEvents[i]["startAt"]);

        if (startDate.getTime() > choiceDate.getTime()) {
          if (startDate.getFullYear() === choiceDate.getFullYear()) {
            if (
              startDate.getMonth().toString() ===
              choiceDate.getMonth().toString()
            ) {
              if (
                startDate.getDate().toString() ===
                choiceDate.getDate().toString()
              ) {
                ar.push(copyEvents[i]);
              }
            }
          }
        }
      }
      setArMeeting(ar);
    }
  }, [choiceDate, events]);

  const previous = () => {
    if (choiceDate) {
      if (new Date(choiceDate).getTime() >= new Date().getTime()) {
        if (choiceDate.getDay() === 1) {
          setChoiceDate(new Date(choiceDate.setDate(choiceDate.getDate() - 3)));
          getDate();
        } else {
          setChoiceDate(new Date(choiceDate.setDate(choiceDate.getDate() - 1)));
          getDate();
        }
      }
    }
  };

  const next = () => {
    if (choiceDate) {
      if (choiceDate.getDay() === 5) {
        setChoiceDate(new Date(choiceDate.setDate(choiceDate.getDate() + 3)));
        getDate();
      } else {
        setChoiceDate(new Date(choiceDate.setDate(choiceDate.getDate() + 1)));
        getDate();
      }
    }
  };

  const handlerClick = (year: any, month: any, day: any, hour: any) => {
    let create = new Date(year, month, day, day, hour);
    if (new Date(create).getTime() > new Date().getTime()) {
      setDisplayModal(true);
      setDateMeeting(create);
    }
  };

  const getDate = () => {
    let copyEvents = [...events];
    let ar = [];
    for (let i = 0; i < copyEvents.length; i++) {
      let startDate = new Date(copyEvents[i]["startAt"]);
      if (startDate.getTime() > choiceDate.getTime()) {
        if (startDate.getFullYear() === choiceDate.getFullYear()) {
          if (
            startDate.getMonth().toString() === choiceDate.getMonth().toString()
          ) {
            if (
              startDate.getDate().toString() === choiceDate.getDate().toString()
            ) {
              ar.push(copyEvents[i]);
            }
          }
        }
      }
    }
    setArMeeting(ar);
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

  const goCurrent = () => {
    setChoiceDate(new Date());
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
              getDate();
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
              getDate();
            } else {
              newDate = new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                getAllDay[getAllDay.length - 1].getDate()
              );
              setChoiceDate(newDate);
              getDate();
            }
          } else {
            setChoiceDate(new Date());
            getDate();
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
              getDate();
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
              getDate();
            } else {
              newDate = new Date(
                copyDate.getFullYear(),
                Number(p) - 1,
                copyDate.getDate()
              );
              setChoiceDate(newDate);
              getDate();
            }
          } else {
            setChoiceDate(new Date());
            getDate();
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
        getDate();
      } else if (
        new Date(year, copyDate.getMonth(), copyDate.getDate()).getDay() === 6
      ) {
        newDate = new Date(year, copyDate.getMonth(), copyDate.getDate() + 2);
        setChoiceDate(newDate);
        getDate();
      } else {
        newDate = new Date(year, copyDate.getMonth(), copyDate.getDate());
        setChoiceDate(newDate);
        getDate();
      }
    } else {
      setChoiceDate(new Date());
      getDate();
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
      getDate();
    } else {
      setChoiceDate(new Date());
      getDate();
    }
  };
  return (
    <>
      {choiceDate && (
        <div className={styles.datePicker}>
          <div className={styles.datePicker__head}>
            <span
              onClick={() => {
                previous();
              }}
              className={styles.datePicker__head__previous}
            ></span>
            <Image
              className={styles.datePicker__head__home}
              onClick={() => {
                goCurrent();
              }}
              src="/assets/icone/home.png"
              alt=""
              width={"20"}
              height={"20"}
            />
            <div className={styles.datePicker__head__div}>
              <div
                className={`${styles.datePicker__head__div__div} ${styles.datePicker__head__div__div__day}`}
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
                  setArDay(ar);
                }}
              >
                <p
                  className={`${styles.datePicker__head__div__div__p} ${styles.datePicker__head__div__marginR}`}
                >
                  {choiceDate.getDate()}
                </p>
                <div className={styles.datePicker__head__div__div__i}>
                  {userClickSelectDay === true && (
                    <div className={styles.datePicker__head__div__div__div}>
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
                                  styles.datePicker__head__div__div__div__div__current
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
                                styles.datePicker__head__div__div__div__div
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
                className={`${styles.datePicker__head__div__div} ${styles.datePicker__head__div__div__month}`}
                onClick={() => {
                  setUserClickSelectMonth(!userClickSelectMonth);
                }}
              >
                <p
                  className={`${styles.datePicker__head__div__div__p} ${styles.datePicker__head__div__div__marginR}`}
                >
                  {monthstext[choiceDate.getMonth() + 1]}
                </p>
                <div className={styles.datePicker__head__div__div__i}>
                  {userClickSelectMonth === true && (
                    <div className={styles.datePicker__head__div__div__div}>
                      {Object.entries(monthstext).map((p: any, index: any) => {
                        if (monthstext[choiceDate.getMonth() + 1] === p[1]) {
                          return (
                            <div
                              onClick={() => {
                                changeMonth(p[1]);
                              }}
                              className={
                                styles.datePicker__head__div__div__div__div__current
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
                              styles.datePicker__head__div__div__div__div
                            }
                            key={index}
                          >
                            {p[1]}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`${styles.datePicker__head__div__div} ${styles.datePicker__head__div__div__year}`}
                onClick={() => {
                  setUserClickSelectYear(!userClickSelectYear);
                }}
              >
                <p className={styles.datePicker__head__div__div__p}>
                  {choiceDate.getFullYear()}
                </p>
                <div className={styles.datePicker__head__div__div__i}>
                  {userClickSelectYear && (
                    <div className={styles.datePicker__head__div__div__div}>
                      {Object.entries(yearar).map((p: any, index: any) => {
                        if (choiceDate.getFullYear() === p[1]) {
                          return (
                            <div
                              onClick={() => {
                                changeYear(p[1]);
                              }}
                              className={
                                styles.datePicker__head__div__div__div__div__current
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
                              styles.datePicker__head__div__div__div__div
                            }
                            key={index}
                          >
                            {p[1]}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                <th className={styles.datePicker__table__thead__tr__th}></th>
                <th className={styles.datePicker__table__thead__tr__th__day}>
                  {daystext[choiceDate.getDay()]} {choiceDate.getDay()}{" "}
                  {monthstext[choiceDate.getMonth()]} {choiceDate.getFullYear()}
                </th>
              </tr>
            </thead>
            <tbody>
              {hourtext &&
                Object.entries(hourtext).map((h: any, index: any) => {
                  return (
                    <tr
                      key={index}
                      className={styles.datePicker__table__tbody__tr}
                    >
                      <td
                        className={
                          styles.datePicker__table__tbody__tr__td__hour
                        }
                      >
                        {h[1]}h
                      </td>
                      {arMeeting &&
                        arMeeting.map((p: any) => {
                          let dateDayMeeting = new Date(p.startAt);
                          if (
                            dateDayMeeting.getUTCHours().toString() ===
                            h[1].toString()
                          ) {
                            if (
                              user.user.id.toString() === p.userId.toString()
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
                                ></td>
                              );
                            }
                          }
                          return null;
                        })}
                      <td
                        onClick={() => {
                          handlerClick(
                            choiceDate.getFullYear(),
                            choiceDate.getMonth(),
                            choiceDate.getDate(),
                            h[1]
                          );
                        }}
                        className={styles.datePicker__table__tbody__tr__td}
                        key={index}
                      ></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DatePickerEditMobile;
