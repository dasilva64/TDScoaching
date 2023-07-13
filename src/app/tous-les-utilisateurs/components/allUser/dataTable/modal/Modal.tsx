import React, { useEffect, useState } from "react";
import styles from "./Modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";

const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [meeting, setMeeting] = useState<any>(null);
  const [meetingP, setMeetingP] = useState<any>(null);
  const [see, setSee] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nbShow, setNbShow] = useState<number>(2);
  const { userData } = useSelector((state: RootState) => state.Array);
  const [sortBy, setSortBy] = useState(["", ""]);
  const [display, setDisplay] = useState(true);
  const closeForm = () => {
    dispatch({
      type: "Array/changeDisplayModal",
      payload: { display: false },
    });
  };

  let countPage = Math.ceil(meeting?.length / nbShow);

  useEffect(() => {
    const push = (
      array: any,
      start: any,
      end: any,
      type: any,
      page: any,
      key: any
    ) => {
      if (type === "for") {
        for (let i = start; i < end; i++) {
          if (i === currentPage) {
            array.push(
              <span
                className={styles.userModal__paging__div__div__span__current}
                onClick={() => {
                  setCurrentPage(i);
                  setDisplay(true);
                }}
                key={i + 30}
              >
                {i}
              </span>
            );
          } else {
            array.push(
              <span
                className={styles.userModal__paging__div__div__span}
                onClick={() => {
                  setCurrentPage(i);
                  setDisplay(true);
                }}
                key={i + 60}
              >
                {i}
              </span>
            );
          }
        }
      } else if (type === "point") {
        array.push(
          <span
            key={key}
            className={styles.userModal__paging__div__div__span__point}
          >
            ...
          </span>
        );
      } else {
        array.push(
          <span
            key={key}
            className={styles.userModal__paging__div__div__span}
            onClick={() => {
              setCurrentPage(page);
              setDisplay(true);
            }}
          >
            {page}
          </span>
        );
      }
    };
    let ar: any = [];
    if (countPage > 8) {
      if (currentPage <= 4) {
        ar = [];
        push(ar, 1, 6, "for", null, null);
        push(ar, null, null, "point", null, 7);
      } else if (currentPage >= countPage - 3) {
        ar = [];
        push(ar, null, null, "start", 1, 8);
        push(ar, null, null, "point", null, 9);
        push(ar, countPage - 4, countPage + 1, "for", null, null);
      } else {
        ar = [];
        push(ar, null, null, "start", 1, 3);
        push(ar, null, null, "point", null, 1);
        push(ar, currentPage - 1, currentPage + 2, "for", null, null);
        push(ar, null, null, "point", null, 2);
        push(ar, null, null, "end", countPage, 100);
      }
    } else {
      push(ar, 1, countPage + 1, "for", null, null);
    }

    setSee(ar);
  }, [countPage, currentPage, dispatch]);

  useEffect(() => {
    const fetchAllMeeting = async () => {
      let cookieToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      let response = await fetch(
        `http://localhost:8080/meeting/all/${userData.email}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: "Bearer " + cookieToken,
          },
        }
      );
      let json = await response.json();
      if (!meeting) {
        setMeeting(json.body);
      }
    };
    fetchAllMeeting();
  }, [meeting, userData.email]);

  useEffect(() => {
    let ar: any = [];
    if (meeting && meeting.length > 0 && display === true) {
      setSortBy(["startAt", "ASC"]);
      for (let i = (currentPage - 1) * nbShow; i < currentPage * nbShow; i++) {
        ar.push(meeting[i]);
      }
      setDisplay(false);
      setMeetingP(ar);
    }
  }, [currentPage, display, meeting, nbShow, sortBy]);

  const handlerClick = () => {
    const fetchRemove = async () => {
      let cookieToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      let response = await fetch(
        `http://localhost:8080/user/admin/${userData.email}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: "Bearer " + cookieToken,
          },
        }
      );
      let json = await response.json();
      if (json.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: json.message, type: "success" },
        });
        dispatch({
          type: "Array/changeDisplayModal",
          payload: { display: false },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: json.message, type: "error" },
        });
        dispatch({
          type: "Array/changeDisplayModal",
          payload: { display: false },
        });
      }
    };
    fetchRemove();
  };

  const handlerSortBy = (e: any) => {
    if (sortBy[1] === "ASC") {
      let ar = meeting;
      let test = Object.entries(ar).sort(function (a: any, b: any): any {
        let c: any = new Date(a[1]["startAt"]);
        let d: any = new Date(b[1]["startAt"]);

        return c - d;
      });
      let pp = [];
      for (let i = 0; i < test.length; i++) {
        pp.push(test[i][1]);
      }
      setSortBy(["startAt", "DESC"]);
      edt(pp);
    } else {
      let ar = meeting;
      let test = Object.entries(ar).sort(function (a: any, b: any): any {
        let c: any = new Date(a[1]["startAt"]);
        let d: any = new Date(b[1]["startAt"]);

        return d - c;
      });
      let pp = [];
      for (let i = 0; i < test.length; i++) {
        pp.push(test[i][1]);
      }

      setSortBy(["startAt", "ASC"]);
      edt(pp);
    }
  };

  const edt = (data: any) => {
    let ar: any = [];
    for (let i = (currentPage - 1) * nbShow; i < currentPage * nbShow; i++) {
      ar.push(data[i]);
    }
    setMeetingP(ar);
  };
  return (
    <div className={styles.userModal}>
      <button className={styles.userModal__btn} onClick={() => closeForm()}>
        <span className={styles.userModal__btn__cross}>&times;</span>
      </button>
      <h1 className={styles.userModal__h1}>
        Information de l&apos;utilisateur
      </h1>
      <div>
        {Object.entries(userData).map((p: any, index: any) => {
          if (p[0] === "status") {
            return (
              <p key={index}>
                {p[0]} : {p[1] === true ? "true" : "false"}
              </p>
            );
          }
          return (
            <p key={index}>
              {p[0]} : {p[1]}
            </p>
          );
        })}
      </div>
      <div className={styles.userModal__div}>
        <table className={styles.userModal__div__table}>
          <thead className={styles.userModal__div__table__thead}>
            <tr className={styles.userModal__div__table__thead__tr}>
              <th className={styles.userModal__div__table__thead__tr__th}>
                description
              </th>
              {sortBy[1] === "ASC" && (
                <th
                  className={`${styles.userModal__div__table__thead__tr__th} ${styles.userModal__div__table__thead__tr__th__asc}`}
                  onClick={(e) => handlerSortBy(e)}
                >
                  start
                </th>
              )}
              {sortBy[1] === "DESC" && (
                <th
                  className={`${styles.userModal__div__table__thead__tr__th} ${styles.userModal__div__table__thead__tr__th__desc}`}
                  onClick={(e) => handlerSortBy(e)}
                >
                  start
                </th>
              )}

              <th className={styles.userModal__div__table__thead__tr__th}>
                end
              </th>
            </tr>
          </thead>
          <tbody className={styles.userModal__div__table__tbody}>
            {meetingP &&
              meetingP.map((p: any, index: any) => {
                if (p === undefined) {
                  return null;
                }
                let start = new Date(p.startAt);
                start.toLocaleDateString();
                let end = new Date(p.endAt);
                end.toLocaleTimeString();
                return (
                  <tr
                    className={styles.userModal__div__table__tbody__tr}
                    key={index}
                  >
                    <td className={styles.userModal__div__table__tbody__tr__td}>
                      {p.description}
                    </td>
                    <td className={styles.userModal__div__table__tbody__tr__td}>
                      {new Intl.DateTimeFormat("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                      }).format(start)}
                    </td>
                    <td className={styles.userModal__div__table__tbody__tr__td}>
                      {new Intl.DateTimeFormat("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                      }).format(end)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className={styles.userModal__paging}>
        <p>
          Showing {(currentPage - 1) * nbShow + 1} to{" "}
          {meetingP?.length! < currentPage * nbShow
            ? meetingP?.length
            : currentPage * nbShow}{" "}
          of {meetingP?.length} entries
        </p>
        <div className={styles.userModal__paging__div}>
          <span
            className={styles.userModal__paging__div__span}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                setDisplay(true);
              }
            }}
          >
            previous
          </span>
          <div className={styles.userModal__paging__div__div}>{see}</div>
          <span
            className={styles.userModal__paging__div__span}
            onClick={() => {
              if (currentPage < Math.ceil(meeting?.length! / nbShow)) {
                setCurrentPage(currentPage + 1);
                setDisplay(true);
              }
            }}
          >
            next
          </span>
        </div>
      </div>
      <div className={styles.userModal__div}>
        <button
          className={styles.userModal__div__btn}
          onClick={() => {
            handlerClick();
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default Modal;
