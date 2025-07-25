import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DisplayOne from "./DisplayOne";
import styles from "./Display.module.scss";
import { RootState } from "@/app/redux/store/store";

const Display = () => {
  const [keyAr, setKeyAr] = useState<string[]>([]);
  const [see, setSee] = useState<any[] | null>(null);
  const dispatch = useDispatch();
  const { datas, currentPage, nbShow, sortBy } = useSelector(
    (state: RootState) => state.ArrayMeetingByUser
  );

  /* useEffect(() => {
    dispatch({
      type: "ArrayMeetingByUser/resetData",
    });
  }, [dispatch]); */
  useEffect(() => {
    if (datas && datas.length > 0) {
      setKeyAr(["Type de l'offre", "Type de coaching", "Statut du paiement", "Dernier rendez-vous"]);
    }
  }, [datas]);
  /* useEffect(() => {
    if (sortBy[0] === "" && sortBy[1] === "") {
      if (keyAr[0]) {
        dispatch({
          type: "Array/changeSortBy",
          payload: { sortBy: [keyAr[0], "ASC"] },
        });
      }
    }
  }, [dispatch, keyAr, sortBy]); */
  useEffect(() => {
    if (sortBy[0] === "" && sortBy[1] === "" && keyAr[0]) {
      dispatch({
        type: "ArrayMeetingByUser/changeSortBy",
        payload: { sortBy: [keyAr[0], "ASC"] },
      });
      let arr: any = datas;
      let newat: any = Object.entries(arr).sort(function (a: any, b: any): any {
        return a[1][keyAr[0]] > b[1][keyAr[0]];
      });

      let test: any = [];
      for (let i = 0; i < newat.length; i++) {
        test.push(newat[i][1]);
      }
      dispatch({
        type: "ArrayMeetingByUser/storeData",
        payload: { datas: test },
      });
      let ar: any = [];
      for (let i = (currentPage - 1) * nbShow; i < currentPage * nbShow; i++) {
        if (datas && datas.length && i < datas.length) {
          ar.push(<DisplayOne key={i} i={i} />);
        }
      }
      setSee(ar);
    } else {
      let ar: any = [];
      if (datas && datas.length > 0) {
        for (
          let i = (currentPage - 1) * nbShow;
          i < currentPage * nbShow;
          i++
        ) {
          if (i < datas.length) {
            ar.push(<DisplayOne key={i} i={i} />);
          }
        }
      } else {
        ar.push(
          <tr key={1}>
            <td
              colSpan={keyAr.length}
              className={`${styles.table__body__tr__td__odd__first} ${styles.table__body__tr__td__odd__first__center}`}
            >
              Aucun rendez-vous n&apos;a été trouvé pour cet utilisateur
            </td>
          </tr>
        );
      }
      setSee(ar);
    }
  }, [currentPage, datas, dispatch, keyAr, nbShow, sortBy]);

  const handlerSortBy = (e: any) => {
    if (e.target.textContent === sortBy[0]) {
      if (sortBy[1] === "DESC") {
        dispatch({
          type: "ArrayMeetingByUser/changeSortBy",
          payload: { sortBy: [e.target.textContent, "ASC"] },
        });
        sortByF(e.target.textContent, "ASC");
      } else {
        dispatch({
          type: "ArrayMeetingByUser/changeSortBy",
          payload: { sortBy: [e.target.textContent, "DESC"] },
        });
        sortByF(e.target.textContent, "DESC");
      }
    } else {
      dispatch({
        type: "ArrayMeetingByUser/changeSortBy",
        payload: { sortBy: [e.target.textContent, "ASC"] },
      });
      sortByF(e.target.textContent, "ASC");
    }
  };

  const sortByF = (element: any, sort: any) => {
    if (sortBy[0] !== "" && sortBy[1] !== "" && keyAr[0]) {
      let arr: any = datas;
      let newat: any = Object.entries(arr).sort(function (a: any, b: any): any {
        if (sort === "DESC") {
          return a[1][element]
            .toString()
            .localeCompare(b[1][element].toString(), undefined, {
              numeric: true,
              sensitivity: "base",
            });
        } else {
          return b[1][element]
            .toString()
            .localeCompare(a[1][element].toString(), undefined, {
              numeric: true,
              sensitivity: "base",
            });
        }
      });

      let test: any = [];
      for (let i = 0; i < newat.length; i++) {
        test.push(newat[i][1]);
      }
      dispatch({
        type: "ArrayMeetingByUser/storeData",
        payload: { datas: test },
      });
    }
  };
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.table__head}>
          <tr className={styles.table__head__tr}>
            {keyAr &&
              keyAr.map((key: any, index: any) => {
                if (key === "meetings") return
                if (key === sortBy[0]) {
                  if (sortBy[1] === "ASC") {
                    if (key === "id") {
                      return (
                        <th
                          className={`${styles.table__head__tr__th} ${styles.table__head__tr__th__asc__little}`}
                          onClick={(e) => handlerSortBy(e)}
                          key={index}
                        >
                          {key}
                        </th>
                      );
                    }
                    return (
                      <th
                        className={`${styles.table__head__tr__th} ${styles.table__head__tr__th__asc}`}
                        onClick={(e) => handlerSortBy(e)}
                        key={index}
                      >
                        {key}
                      </th>
                    );
                  } else {
                    if (key === "id") {
                      return (
                        <th
                          className={`${styles.table__head__tr__th} ${styles.table__head__tr__th__desc__little}`}
                          onClick={(e) => handlerSortBy(e)}
                          key={index}
                        >
                          {key}
                        </th>
                      );
                    }
                    return (
                      <th
                        className={`${styles.table__head__tr__th} ${styles.table__head__tr__th__desc}`}
                        onClick={(e) => handlerSortBy(e)}
                        key={index}
                      >
                        {key}
                      </th>
                    );
                  }
                } else {
                  if (key === "id") {
                    return (
                      <th
                        className={`${styles.table__head__tr__th} ${styles.table__head__tr__th__both__little}`}
                        onClick={(e) => handlerSortBy(e)}
                        key={index}
                      >
                        {key}
                      </th>
                    );
                  }
                  return (
                    <th
                      className={`${styles.table__head__tr__th} ${styles.table__head__tr__th__both}`}
                      onClick={(e) => handlerSortBy(e)}
                      key={index}
                    >
                      {key}
                    </th>
                  );
                }
              })}
          </tr>
        </thead>
        <tbody className={styles.table__body}>{see}</tbody>
      </table>
    </div>
  );
};

export default Display;
