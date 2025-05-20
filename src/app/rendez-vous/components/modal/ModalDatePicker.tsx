/* "use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import useGet from "../../../components/hook/useGet";

const ModalDatePicker = () => {
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserMeeting");
  const { displayModalDiscoveryDatePicker } = useSelector(
    (state: RootState) => state.form
  );
  const dispatch = useDispatch<AppDispatch>();
  const [arDateWeek, setArDateWeek] = useState<any>([]);

  const [startDateWeek, setStartDateWeek] = useState<string>("");

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
            arWeek.push([year, month, date, hour]);
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
    if (
      userData &&
      userData.body &&
      userData.body.meetings &&
      arDateWeek.length === 0
    ) {
      if (startDateWeek === "") {
        let current = new Date();
        let ar = getAllDayInWeek(new Date());
        getMeetingByWeek(ar);
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
  }, [arDateWeek, startDateWeek, userData]);
  const changeDate = (wowtets: any) => {
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
            arWeek.push([year, month, date, hour]);
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
      if (userData.body.discovery === false) {
        dispatch({
          type: "form/openModalFirstMeeting",
          payload: {
            date: create,
          },
        });
      } else {
        if (typeMeeting.type === "flash") {
          if (typeMeeting.number === 3) {
            dispatch({
              type: "form/openModalMeeting",
              payload: {
                date: create,
              },
            });
          } else {
            dispatch({
              type: "form/openModalOtherMeeting",
              payload: {
                date: create,
              },
            });
          }
        } else {
        dispatch({
          type: "form/openModalMeeting",
          payload: {
            date: create,
          },
        });
        //}
      }
    }
  };

  const goCurrent = () => {
    let current = new Date();
    changeDate(current.toDateString());
    setArDateWeek([]);
  };
  const closeForm = () => {
    dispatch({
      type: "form/closeModalDateDiscoveryPicker",
    });
  };
  return (
    <>
      <AnimatePresence>
        {displayModalDiscoveryDatePicker === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
              className={styles.container}
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
              exit={{ y: 200, opacity: 0, transition: { duration: 0.3 } }}
            >
              <h2 style={{ marginBottom: "50px", marginTop: "50px" }}>
                Sélectionnez un rendez-vous
              </h2>
              <button className={styles.btn} onClick={() => closeForm()} onMouseDown={(e) => e.preventDefault()}>
                <Image
                  className={styles.btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
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
                    sizes="100vw"
                    width={"0"}
                    height={"0"}
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
                                  styles.datePicker__table__thead__tr__th__div
                                }
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalDatePicker; */
